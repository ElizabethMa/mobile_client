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
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.PKCS10CertificationRequestBuilder;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;


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
        } else if (action.equals(Sign_ACTION)){
            String sn = args.getString(0);
            String p7cert =  args.getString(1);
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

    private String signData(String sn, String p7cert, String src){
        try {
            Log.i(TAG, "sn : " + sn);
            Log.i(TAG, "p7cert : " + p7cert);
            Log.i(TAG, "src : " + src);

            SharedPreferences sp = this.cordova.getActivity().getSharedPreferences("SP", 0x0000);
            String strPrivateKey = sp.getString("PRIVATE_KEY", "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDj7eVDMPRPBMrv/gMP2ro8Ia6bdn0oHtCfQD5SwSQe8hQqduZA8Pj23x7OiTQotGg2Pz9vFG3HZ2e6kgJgRZMUjnXSN95WUP4jHCFpURy/c5GUYiDz/Kn8iu5ay6ksyLZ517T6+ml2gkStq34CPPlHBoFfxKD56z9KDrYQRndDjHow6bDZSwijbld2rbyq1tLKPgsCxlO23ESnqbdHm/u+dVr1AATKvrg/s+ZMtpeOW9K3skoJZQvC1ZtElTUDKeVj3ESw9GTlg1NwXjZnf/L7/EJ8wZeNGAhs2V/mV4nyfJ8xDuhuvehKxnPaLg/nKt06pgZoc/dPEFXv4wDjt763AgMBAAECggEAU145ZCkswxZKsBtlvU/QnJvpRL3DK4CR6B3UbeptLtB2pc2VjJ1XQtz7ZKn0pQrPrz/VEOkU+kGNREWRjusD0BoHaFu8/C9ltSvd4KqlbDV2QyLdUMDS4Cdk5VrmxxWnAMvwS3h6SLl/K1K1pVXuC5eKjJ/cDW2JWaol17AegVrYtg+c5FZSOQEKfzNMKkNYXxy1OMdjl6XyyXn8uNdw9WgCHTA222KdYbOZJ+2/nZLkKc7dKG1Tki6DKV5A9UaKWowVhiM0ZbrnL8AYcGrwWQhWk5HBJfnSZGZ2+qobYzlrYQAmrlLGfVG0sSLIQRT2Be5Cu4hhOLHBsoV1OYHrMQKBgQD38fLcB12nAAGrYTUrJu1LAPx3QqSR2I6cHUyhLQmWYSWPU8Hq/0vVsdyU/UVZF9/vCqXG8mkq0S9PBHk03ltwQo7WqAKsWezVYZl3CcFU8OOQfMjblYR5mF6Dwn0+ugGHQVFM2yVtMLFhCbLiKBV7HHPp6yWpGyi6uT2/8XZwuQKBgQDrVXvje84QG2gbTxxeJreC3mEnL/5s4UQ5QTt5wbdRPu29oHhbenXmK8rKwLX+RnEbFbVYhJVKbmsLPsJigfWERdUlIkH43ngDiOAxJstOpBslJeQoYNhiQwPXvRqH6LpU2+RxKbPrLtdgo1rbr6C9aHgZHe+k9nnemTzXnTOS7wKBgEE4VJDKIzlliArjpA+4ypx7Iu3gCtgOZdzs3BZdeXMkFLQx7QV6qCELCyHpyU8ZN59yZo8BfuZzZgVcAOIGR3ktGNOgGCvr759lb+/fEgrc3o9IM7GHD/TIPrxb8YQJe5NvfApCbwLc1xvWaEaTEqtynY7/esWTzk/noDWYN3aJAoGBALOvucCgL16tDniLlyVseoI6OgQp6SJJfkYZQMhe2RH38p7vf/aZMpxko5rcOhnEv2fm02ibE0KZvLIBYXrFsCknCPApkCXt98T7JfNho6qQMwnSPLt39sBQWwbHJRLQ6DUTEQI2zWGtilYHZMCJATqeIdVLvkc+yx7j8kjPhymRAoGAcrQEUght9KED56xOOog83/9Es8UxzaB5P/EbCP7dvv4PoE2wbzUUHVn7Arwvvbu7VvoVqJVMj1JUviWHfzPuD/PBbI5ecTpxR3CHxi3pcuam9fo977D1p7FvCSjyznyHxreYIaSwNpqrAWOJkw7+F9OzBthlO/Wc04OWKIW8QgY=");
            Log.i(TAG, "strPrivateKey : " + strPrivateKey);

//            byte[] keyBytes = (new BASE64Decoder()).decodeBuffer(strPrivateKey);
            byte[] keyBytes = Base64.decode(strPrivateKey, 0);
            PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(pkcs8KeySpec);

            Signature signature = Signature.getInstance("SHA1withRSA");
            signature.initSign(privateKey);
            signature.update(src.getBytes());
            byte[] result = signature.sign();

//            Log.i(TAG, "sign : " + Hex.encode(result));
            Log.i(TAG, "sign : " + Base64.encodeToString(result, 0));

            

            return Base64.encodeToString(result, 0);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    private String getPriAndCsr(){
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



}
