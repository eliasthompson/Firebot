(function(){
  
 // This handles the Groups tab
 
 const _ = require('underscore')._;
 
 angular
   .module('firebotApp')
   .controller('groupsController', function($scope, groupsService, utilityService) {
     $scope.groupsService = groupsService;   
     /**
     * On tab load
     */
     // Make sure groups are loaded into memory    
     groupsService.loadViewerGroups();
     
     /*
     * ADD/EDIT BOARD MODAL
     */
    $scope.showAddEditGroupModal = function(groupToEdit) {
      var addEditGroupModalContext = {
        templateUrl: "addEditViewerGroupModal.html",
        // This is the controller to be used for the modal. 
        controllerFunc: ($scope, $uibModalInstance, groupToEdit) => {
          // The model for the board id text field
          $scope.group = {
            groupName: "",
            users: []
          };        
          
          $scope.isNewGroup = groupToEdit == null;
          
          if(!$scope.isNewGroup) {
            $scope.group = $.extend(true, {}, groupToEdit);
          }
          
          $scope.pagination = {
            currentPage: 1,
            pageSize: 5
          }
          
          $scope.addNewUser = function() {
            if($scope.newUser != null && $scope.newUser != "") {
              $scope.group.users.push($scope.newUser);
            }            
            $scope.newUser = "";
          }
          
          $scope.deleteUserAtIndex = function(index) {
            $scope.group.users.splice(index,1);
          }
          
          // When the user clicks "Save/Add", we want to pass the group back
          $scope.saveChanges = function(shouldDelete) {
            shouldDelete = (shouldDelete == true);
            if(!shouldDelete && $scope.group.groupName == "") return;
            $uibModalInstance.close({
              shouldDelete: shouldDelete,
              group: shouldDelete ? groupToEdit : $scope.group
            });
          };
          
          // When they hit cancel or click outside the modal, we dont want to do anything
          $scope.dismiss = function() {
            $uibModalInstance.dismiss();
          };
        },        
        resolveObj: {
          groupToEdit: () => {            
            if(groupToEdit != null) {
              return $.extend(true, {}, groupToEdit);
            } else {
              return null;
            }            
          }
        },
        // The callback to run after the modal closed via "Save changes" or "Delete"
        closeCallback: (context) => {
          var group = context.group;
          if(context.shouldDelete == true) {
            groupsService.removeViewerGroup(group.groupName);
          } else {
            groupsService.addOrUpdateViewerGroup(group, groupToEdit.groupName);
          }                      
        }
      }      
      utilityService.showModal(addEditGroupModalContext);
    };

   });
 })();