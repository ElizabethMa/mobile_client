define(['utils'], function (Utils) {
       
       function init(params) {
              Utils.bindEvents(params.bindings);
       }

       function render(params) {
              var template = $$('#profileTemplate').html();
              var compiledTemplate = Template7.compile(template);

              // 添加 推荐人姓名、编号
              params.model.uPresence.val1 = "信易";
              params.model.uPresence.val2 = "xinyi";
              var renderTemplate = compiledTemplate({model: params.model});


              $$('#profileContent').append(renderTemplate);

              Utils.bindEvents(params.bindings);
              resetSelect();
              //如果是二次开户，就隐藏返回键
              if(params.model.openTimes==2){
                     var element = document.getElementById("backBtn");
                     if(element){
                            element.style.display = "none";
                     }
              }
       }

       function resetSelect() {
              $$('.smart-select select').each(function () {
                     this.selectedIndex = -1;
              });
       }

       function show(params) {
              if(params == "1"){
                     var element = document.getElementById("qq");
                     if(element){
                            if(element.style.display == "none"){
                                   element.style.display = "block";
                            }
                     }
              }
       }

       return {
              init: init,
              render: render,
              show: show
       };
});
