var app=angular.module('fileUploadAngJS',[]);

  app.directive("accptfiles",function(){
    return{ 
      restrict:"E",
      scope:{},
      //transclude:true,
       template: ['<div>',
                  '<div class="dropzone" id="dropzone"> &nbsp Drop files here',
                    '<span id="removeFileText"> Click file name to remove</span><br><br><br>',
                    '<ul id="dropzoneList">',
                      '<li ng-repeat="(fileId,file) in droppedFiles" id="{{fileId}}">',
                        '<div class="thumbContnr">',
                        '<div><img  class="thumb" ng-src="{{file.fileContent}}"/></div>',
                        //'<div class="fileName">{{file.name}}</div>',
                        '<div><button class="removeBtn" id=buttonId ng-click="deleteFile(fileId);">',
                               '{{file.name}} &#x2715</button>',
                        '</div>',
                        '<div>',
                      '</li>',
                    '</ul>',
                  ' &nbsp or use browse:',
                  '</div>',
                  '<div> <input type="file" id="browsebutton-invisbl" multiple></input>',
                         '<button id="browsebutton-visbl"  >Browse </button>',
                         '<input type="submit" id="submitbutton" value="Upload selected files"',
                         'ng-click="uploadFiles();"/>',
                  '</div>',
                  '</div>'].join(''),

      controllerAs:"accptfilesCtrl",
      controller: function($scope){
        $scope.droppedFiles={};
        //test function on controller
        //this.functionOnCtrl=function(){console.log("controller test $scope=",$scope)};
        //this.functionOnCtrl();
      },

      link: function(scope,elt,attrs){
        //scope.accptfilesCtrl.functionOnCtrl(); //console.log

        function makeFileId(fileElt){
          fileId=[fileElt.name,fileElt.lastModifiedDate.getTime()].join('');
          return fileId;
        }
        
        //test function on scope
        //scope.functionOnScope=function(){console.log("functionOnScope");}

        scope.addFiles=function(evt,newFiles){
          for (var i=0; i<newFiles.length;i++){
              var f=newFiles[i];
              if (f.type.match("image.*")){              
                var fId=makeFileId(f); 
                if (!(fId in scope.droppedFiles)) { 
                  scope.renderThmbnail(f);
                  scope.droppedFiles[fId]=f;
              //scope.$digest();
                }
              }         
          } 
        }

        scope.deleteFile=function(rmvFileId){

          if (rmvFileId in scope.droppedFiles) {            
            delete scope.droppedFiles[rmvFileId];
          };
        }

        //scope.escapeFnctn=function(string){escape(string);}

        scope.handleMouseOut=function(evt){
          evt.target.style.background="";  //Reset background color
        }

        scope.handleMouseOver=function(evt){
          evt.target.style.background="#f0f0f0"; //Highlight button
        }

        scope.renderThmbnail=function(f){ 
            reader1=new FileReader();
            reader1.onload=(
              function(newFile){
              return function(evt){
                f.fileContent=evt.target.result;
                scope.$digest();
              };
            })(f);
  
            reader1.readAsDataURL(f);
        }

        scope.uploadFiles=function(){
          console.log('uploadFiles function droppedFiles=',scope.droppedFiles);
        }
      }
    }
  })  


  app.directive("accptfilesDnd",function(){
    return{
      restrict:"A",
      require: "^accptfiles",
      link: function(scope,elt,attrs,accptfilesCtrl){ 

        function handleDragEnter(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          // highlight potential drop target when the draggable element enters it
          evt.target.style.background="#e8e8e8";
          //document.getElementById("dropzone").style.background="#e8e8e8";
        }

        function handleDragOver(evt){
          evt.preventDefault();
          evt.stopPropagation();
          evt.dataTransfer.dropEffect="copy";
        }

        function handleDragLeave(evt){          
          evt.preventDefault();
          evt.stopPropagation();
          evt.target.style.background = "";  //Reset background color
          //document.getElementById("dropzone").style.background="";        
        }

        function handleDrop(evt){
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect="copy";
            evt.target.style.background = ""; //Reset background color
            //document.getElementById("dropzone").style.background="";        

            scope.addFiles(evt,evt.dataTransfer.files);
           
            console.log("scope.droppedFiles=",scope.droppedFiles);
            console.log("evt.dataTransfer.files",evt.dataTransfer.files);
        }

        function handleNoDragEnter(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          evt.dataTransfer.effectAllowed="none";
          evt.dataTransfer.dropEffect="none";
        }

        function handleNoDragOver(evt){
          evt.preventDefault();
          evt.stopPropagation();
          evt.dataTransfer.effectAllowed="none";
          evt.dataTransfer.dropEffect="none";
        }

        function handleNoDragLeave(evt){          
          evt.preventDefault();
          evt.stopPropagation();
        }

        function handleNoDrop(evt){          
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect="none";
        }

        window.addEventListener("dragenter",handleNoDragEnter,false);
        window.addEventListener("dragover",handleNoDragOver,false);
        window.addEventListener("dragleave",handleNoDragLeave,false);
        window.addEventListener("drop", handleNoDrop,false);

        document.getElementById("dropzone").addEventListener("dragenter",handleDragEnter,false);
        document.getElementById("dropzone").addEventListener("dragover",handleDragOver,false);
        document.getElementById("dropzone").addEventListener("dragleave",handleDragLeave,false);
        document.getElementById("dropzone").addEventListener("drop", handleDrop,false);

        //console.log("document.getElementById('dropzone')=",document.getElementById('dropzone'));
        //console.log("elt=",elt);
        // elt.bind("dragenter",handleDragEnter);
        // elt.bind("dragover",handleDragOver);
        // elt.bind("dragleave",handleDragLeave);
        // elt.bind("drop", handleDrop);          
      } 
    };
  })


  app.directive("accptfilesBrowse", function(){
    return{
      restrict:"A", 
      require:"^accptfiles",

      link: function(scope,elt,attrs,accptfilesCtrl){ 
        
        function handleBrowse(evt){
          scope.addFiles(evt,evt.target.files);
        }

        document.getElementById('browsebutton-visbl').addEventListener('mouseover',scope.handleMouseOver,false);
        document.getElementById('browsebutton-visbl').addEventListener('mouseout',scope.handleMouseOut,false);

        document.getElementById('browsebutton-invisbl').addEventListener('change', handleBrowse, false);
        document.getElementById('browsebutton-visbl').addEventListener('click', function(){
            document.getElementById('browsebutton-invisbl').value="";
            document.getElementById('browsebutton-invisbl').click();
          }, 
          false);
      }
    };
  })

  app.directive("accptfilesUpload",function(){
    return{
      restrict:"A",
      require:"^accptfiles",
      link: function(scope,elt,attra,accptfilesCtrl){

         document.getElementById('submitbutton').addEventListener('mouseover',scope.handleMouseOver,false);
         document.getElementById('submitbutton').addEventListener('mouseout',scope.handleMouseOut,false);
      }
    }
  })

