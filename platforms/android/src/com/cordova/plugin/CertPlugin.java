/**
 * Open.java
 * <p/>
 * Copyright (C) 2014 Carlos Antonio
 * <p/>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 */

package com.cordova.plugin;

import android.content.SharedPreferences;
import android.util.Base64;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.CMSSignedDataGenerator;
import org.bouncycastle.cms.CMSTypedData;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.PKCS10CertificationRequestBuilder;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;
import org.bouncycastle.util.Store;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.ArrayList;

/**
 * This class starts an activity for an intent to view files
 */
public class CertPlugin extends CordovaPlugin {

    private static final String TAG = "CertPlugin";

    public static final String GetCsr_ACTION = "getCsr";
    public static final String Sign_ACTION = "sign";

    private CallbackContext callbackContext;


    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals(GetCsr_ACTION)) {
            String pwd = args.getString(0);
            Log.i(TAG, "password : " + pwd);

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("resultCode", 0);
            jsonObject.put("resultMsg", getPriAndCsr());

            callbackContext.success(jsonObject);
        } else if (action.equals(Sign_ACTION)) {
            String sn = args.getString(0);
            String p7cert = args.getString(1);
            String text = args.getString(2);

            JSONObject jsonObject = new JSONObject();
            jsonObject.put("resultCode", 0);
            jsonObject.put("signStr", signData(sn, p7cert, text));

            callbackContext.success(jsonObject);
        } else {
            callbackContext.error("no " + action + " action");
        }
        return true;
    }

    private String signData(String sn, String p7cert, String src) {
        try {
            Log.i(TAG, "sn : " + sn);
            Log.i(TAG, "p7cert : " + p7cert);
            Log.i(TAG, "src : " + src);

            PrivateKey privateKey = getPrivateKeyFromSP();

            X509Certificate cert = getX509CertificateFromP7cert(p7cert);

            ArrayList<X509Certificate> certList = new ArrayList<X509Certificate>();
            certList.add(cert);

            CMSSignedData sigData = getCMSSignedData(src, certList, privateKey);

            return Base64.encodeToString(sigData.getEncoded(), 0);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    private String getPriAndCsr() {
        try {
            KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
            gen.initialize(2048);
            KeyPair pair = gen.generateKeyPair();
            PrivateKey privateKey = pair.getPrivate();
            Log.i(TAG, "privateKey : " + Base64.encodeToString(privateKey.getEncoded(), 0));
            String strPrivateKey = Base64.encodeToString(privateKey.getEncoded(), 0);

            //获取 SharedPreferences 对象
            SharedPreferences sp = this.cordova.getActivity()
                    .getSharedPreferences("SP", this.cordova.getActivity().getBaseContext().MODE_PRIVATE);

            //存入数据
            SharedPreferences.Editor editor = sp.edit();
            editor.putString("PRIVATE_KEY", strPrivateKey);
            editor.commit();

            //返回 PRIVATE_KEY 的值
            Log.d("SP", sp.getString("PRIVATE_KEY", "none"));

            PublicKey publicKey = pair.getPublic();
//            X500Principal subject = new X500Principal("C=NO, ST=Trondheim, L=Trondheim, O=Senthadev, OU=Innovation, CN=www.senthadev.com, EMAILADDRESS=senthadev@gmail.com");
            ContentSigner signGen = new JcaContentSignerBuilder("SHA1withRSA").build(privateKey);

            X500NameBuilder x500NameBuilder = new X500NameBuilder(BCStyle.INSTANCE);
            X500Name x500Name = x500NameBuilder.build();
            PKCS10CertificationRequestBuilder csrBuilder = new JcaPKCS10CertificationRequestBuilder(x500Name, publicKey);

            PKCS10CertificationRequest csr = csrBuilder.build(signGen);

            Log.i(TAG, Base64.encodeToString(csr.getEncoded(), 0));

            return Base64.encodeToString(csr.getEncoded(), 0);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    private CMSSignedData getCMSSignedData(String src, ArrayList<X509Certificate> certList, PrivateKey privateKey) {
        try {
            CMSTypedData msg = new CMSProcessableByteArray(src.getBytes());
            Store certs = new JcaCertStore(certList);
            CMSSignedDataGenerator gen = new CMSSignedDataGenerator();
            ContentSigner sha1Signer = new JcaContentSignerBuilder("SHA1withRSA").setProvider("BC").build(privateKey);
            gen.addSignerInfoGenerator(
                    new JcaSignerInfoGeneratorBuilder(
                            new JcaDigestCalculatorProviderBuilder().setProvider("BC").build())
                            .build(sha1Signer, certList.get(0)));
            gen.addCertificates(certs);
            return gen.generate(msg, false);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private X509Certificate getX509CertificateFromP7cert(String p7cert) {
        try {
            byte[] encapSigData = Base64.decode(p7cert, 0);
//            ArrayList<X509Certificate> certList = new ArrayList<X509Certificate>();
            CMSSignedData s = new CMSSignedData(encapSigData);
            Store certStore = s.getCertificates();
            JcaX509CertificateConverter converter = new JcaX509CertificateConverter();
            @SuppressWarnings("unchecked")
            ArrayList<X509CertificateHolder> certificateHolders = (ArrayList<X509CertificateHolder>) certStore
                    .getMatches(null);
            for (X509CertificateHolder holder : certificateHolders) {
                X509Certificate cert = converter.getCertificate(holder);

                X500Name x500Name = holder.getSubject();
                RDN[] rdns = x500Name.getRDNs(BCStyle.CN);
                RDN rdn = rdns[0];
                String name = IETFUtils.valueToString(rdn.getFirst().getValue());
                if (!name.contains("ROOT")) {
                    //cn 里面不包括 ROOT 即是公钥证书
                    return cert;
                }
//                certList.add(cert);
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private PrivateKey getPrivateKeyFromSP() {
        try {
            SharedPreferences sp = this.cordova.getActivity().getSharedPreferences("SP", 0x0000);
            String strPrivateKey = sp.getString("PRIVATE_KEY", "");
            Log.i(TAG, "strPrivateKey : " + strPrivateKey);
            byte[] keyBytes = Base64.decode(strPrivateKey, 0);
            PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(pkcs8KeySpec);
            return privateKey;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


}
