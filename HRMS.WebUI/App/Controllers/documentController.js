(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('documentController', documentController);

    documentController.$inject = ['$scope', '$location', 'documentService', 'companyService', 'employeeService', 'appointmentService'];

    function documentController($scope, $location, documentService, companyService, employeeService, appointmentService) {

        /////////////////////// On Load /////////////////////////////////////////

        if (window.location.href.toLowerCase().indexOf('categor') > -1) {
            loadDocumentCategorys();
        }
        else if (window.location.href.toLowerCase().indexOf('renewalstatus') > -1) {
            loadDocumentRenewalStatuss();
        }
        else if (window.location.href.toLowerCase().indexOf('documenttype') > -1) {
            loadDocumentTypes();
        }
        else {
            loadDocumentCategorys();
        }
        
        
        //////////////////// Document Detail //////////////////////////////

        var tblDocument;
        $scope.document = {
            DocumentID: 0,
            CompanyID: 0,
            EmployeeID: 0,
            DocumentTypeID: 0,
            SearchName: '',
           // DocumentOwner: '',
            FileLocation: '',
            FileExt: '',
            DocumentIssueDate: '',
            ExpiryDate: '',
            IssuingAuthority: '',
            DocumentNumber: '',
            Remarks: ''
        }
        $scope.isCreateDocument = false;
        $scope.message = "";
        clearDropDowns();
        
        $scope.triggerCreateDocument = function () {
            $scope.isCreateDocument = true;
            $scope.document.DocumentID = 0;
            $scope.document.CompanyID = undefined;
            $scope.document.EmployeeID = undefined;
            $scope.document.DocumentCategoryID = undefined;
            $scope.document.DocumentRenewalStatusID = undefined;
            $scope.document.DocumentTypeID = undefined;
            $scope.document.SearchName = '';
           // $scope.document.DocumentOwner = '';
            $scope.document.FileLocation = undefined;
            $scope.document.DocumentIssueDate = undefined;
            $scope.document.ExpiryDate = undefined;
            $scope.document.IssuingAuthority = '';
            $scope.document.DocumentNumber = '';
            $scope.document.Remarks = '';
            clearDropDowns();
            $('#mdlDocument').modal("show");
            angular.forEach($scope.frmDocument.$error.required, function (field) {
                field.$valid = true;
                field.$dirty = false;
            });
            $scope.frmDocument.txtDocumentIssueDate.$dirty = false;
            $scope.frmDocument.txtDocumentIssueDate.$valid = true;
            $scope.frmDocument.txtExpiryDate.$dirty = false;
            $scope.frmDocument.txtExpiryDate.$valid = true;
            angular.element('#txtFileLocation').removeClass('border-red');
            angular.element('#txtFileLocation').next('span').addClass('hide');
            $('.participant-list ul').html('');
            $('.checkbox-container input[type=checkbox]').prop('checked', false);
            $('.checkbox-container').removeClass('checked').addClass('unchecked');
            $('#txtFileLocation').val('');
            $scope.selectedParticipants = new Array();
        }

        function loadDocuments() {

            documentService.getAllDocument().then(
                   function (response) {
                   
                       if (window.location.href.toLowerCase().indexOf('setting') > -1) {
                           $scope.documents = response;
                       }
                       else {
                           if ($.fn.dataTable.isDataTable('#tblDocument')) {
                               $('#tblDocument').DataTable().destroy();
                           }
                           tblDocument = $('#tblDocument').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "DocumentID" },
                                    { "data": "CompanyID" },
                                    { "data": "EmployeeID" },
                                    { "data": "DocumentCategoryID" },
                                    { "data": "DocumentTypeID" },
                                    { "data": "SearchName" },
                                    { "data": "ProcessOwnerID" },
                                    { "data": "DocumentIssueDate" },
                                    { "data": "ExpiryDate" },
                                   // { "data": "DocumentOwner" },
                                    { "data": "IssuingAuthority" },
                                    { "data": "DocumentNumber" },
                                    { "data": "DocumentRenewalStatusID" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                    {
                                        "render": function (data, type, row) {
                                            return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                        },
                                        "targets": 0
                                    },
                                    { className: "hide_column", "targets": [9] },
                                    {
                                        "render": function (data, type, row) {
                                            return getCompanyById(data);
                                        },
                                        "targets": 1
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getEmployeesById(data);
                                        },
                                        "targets": 2
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getDocumentCategoryById(data);
                                        },
                                        "targets": 3
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getDocumentTypeById(data);
                                        },
                                        "targets": 4
                                    },
                                     {
                                         "render": function (data, type, row) {
                                             return getEmployeesById(data);
                                         },
                                         "targets": 6
                                     },
                                    {
                                        "render": function (data, type, row) {
                                            return ToJavaScriptDate(data);
                                        },
                                        "targets": 7
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return ToJavaScriptDate(data);
                                        },
                                        "targets": 8
                                    },
                                    {
                                        "render": function (data, type, row) {
                                            return getDocumentRenewalStatusById(data);
                                        },
                                        "targets": 11
                                    }

                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                           loadParticipants();
                       }
                         
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        //if (window.location.href.toLowerCase().indexOf('report') == -1) {
            $('#tblDocument').on('click', 'tbody tr i.edit', function () {
                var rowData = $('#tblDocument').DataTable().row($(this).parents('tr')).data();
                    $('.participant-list ul').html('');
                    $('.checkbox-container input[type=checkbox]').prop('checked', false);
                    $('.checkbox-container').removeClass('checked').addClass('unchecked');
                    $scope.selectedParticipants = new Array();
                    for (var i = 0; i < $scope.participants.length; i++) {
                        if ($scope.participants[i].DocumentID == rowData.DocumentID) {
                            addParticipantToList($scope.participants[i].EmployeeID, $('.checkbox-container[data-employeeID=' + $scope.participants[i].EmployeeID + ']').parents('a'));
                        }
                    }
                    $scope.participant.DocumentID = rowData.DocumentID;
                if (rowData != undefined) {
                    $scope.$apply(function () {
                        $scope.document.DocumentID = rowData.DocumentID;
                        $scope.document.CompanyID = rowData.CompanyID;
                        $scope.document.EmployeeID = rowData.EmployeeID;
                        $scope.document.DocumentCategoryID = rowData.DocumentCategoryID;
                        $scope.document.DocumentTypeID = rowData.DocumentTypeID;
                        $scope.document.SearchName = rowData.SearchName;
                      // $scope.document.DocumentOwner = rowData.DocumentOwner;
                        $scope.document.DocumentIssueDate = ToJavaScriptDate(rowData.DocumentIssueDate);
                        $scope.document.ExpiryDate = ToJavaScriptDate(rowData.ExpiryDate);
                        $scope.document.IssuingAuthority = rowData.IssuingAuthority;
                        $scope.document.DocumentNumber = rowData.DocumentNumber;
                        $scope.document.DocumentRenewalStatusID = rowData.DocumentRenewalStatusID;
                        $scope.document.Remarks = rowData.Remarks;
                        $scope.document.ProcessOwnerID = rowData.ProcessOwnerID
                        $scope.selectedCompanyName = getCompanyById(rowData.CompanyID);
                        $scope.selectedOwnerName = getEmployeesById(rowData.EmployeeID);
                        $scope.selectedProcessOwnerName = getEmployeesById(rowData.ProcessOwnerID);
                        $scope.selectedDocumentCategoryName = getDocumentCategoryById(rowData.DocumentCategoryID);
                        $scope.selectedDocumentTypeName = getDocumentTypeById(rowData.DocumentTypeID);
                        $scope.selectedDocumentRenewalStatusName = getDocumentRenewalStatusById(rowData.DocumentRenewalStatusID);
                        $scope.employees = getEmployeeByCompanyID(rowData.CompanyID, $scope.allEmployees);
                        $scope.isCreateDocument = false;
                    });
                    $('#txtFileLocation').val('');
                    $('#mdlDocument').modal("show");
                }
            });
        //}
        $('#tblDocument').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.document.DocumentID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlDocumentDelete').modal("show");
        });
        $scope.createDocument = function () {
            if (isDropDownsValid($scope.frmDocument, $scope.document)) {
                $scope.$parent.isNameExist('Document', 0, 'document', $scope.document.SearchName).then(function (response) {
                    if(response.data)   addNotification('Error', 'Document with same name already exists!', 'error');
                    else{
                        $scope.document.FileExt = $('#txtFileLocation').val().split('\\').pop().split('.').pop();
                        $scope.document.Participants = $scope.updateParticipant();
                        $scope.document.DocumentIssueDate = formatDateYYYYmmDD($scope.document.DocumentIssueDate);
                        $scope.document.ExpiryDate = formatDateYYYYmmDD($scope.document.ExpiryDate);
                        documentService.createDocument($scope.document).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Document!', 'success');
                                $('#mdlDocument').modal("hide");
                                loadDocuments();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlDocument').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDocumentType').modal("hide");
                });
            }
        };

        $scope.updateDocument = function () {
            if (isDropDownsValid($scope.frmDocument, $scope.document)) {
                $scope.$parent.isNameExist('Document', $scope.document.DocumentID, 'document', $scope.document.SearchName).then(function (response) {
                    if (response.data) addNotification('Error', 'Document with same name already exists!', 'error');
                    else {
                        $scope.document.FileExt = $('#txtFileLocation').val().split('\\').pop().split('.').pop();
                        $scope.document.Participants = $scope.updateParticipant();
                        $scope.document.DocumentIssueDate = formatDateYYYYmmDD($scope.document.DocumentIssueDate);
                        $scope.document.ExpiryDate = formatDateYYYYmmDD($scope.document.ExpiryDate);
                        documentService.updateDocument($scope.document).then(
                            function (response) {
                                addNotification('Success', 'Record is successfully updated!', 'success');
                                $('#mdlDocument').modal("hide");
                                loadDocuments();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlDocument').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDocumentType').modal("hide");
                });
            }
        };

        $scope.deleteDocument = function () {
            documentService.deleteDocument($scope.document.DocumentID).then(
                function (response) {
                    loadDocuments();
                },
             function (data) {
                 $scope.message = data.error_description;
             });
        };
        $scope.checkSearchName = function () {
            documentService.checkSearchName($scope.document.SearchName).then(
                function (response) {
                    if (!response) {
                        addNotification('Error', 'File Search Name Already Exists!', 'error');
                        $scope.document.SearchName = undefined;
                    }
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        }

        $scope.dateChange = function () {
            try{
                if (new Date($scope.document.DocumentIssueDate) > new Date($scope.document.ExpiryDate)) {
                    $scope.document.ExpiryDate = formatDate(new Date($scope.document.DocumentIssueDate).addDays(1));
                    addNotification('Error','Issue Date cannot be greater than Expiry Date!','error');
                }
            }
            catch(e){}
        }
        $scope.viewDocument = function () {
            var _documentTypeName = getDocumentTypeById($scope.document.DocumentTypeID);
            window.open('../Content/Documents/' + _documentTypeName + '/' + $scope.document.SearchName, '_blank');
        }

        function loadParticipants() {

            appointmentService.getAllParticipants().then(
                  function (response) {
                      $scope.participants = response;
                      //loadEmployees();
                  },
                function (data) {
                    $scope.message = data.error_description;
                });
        }
        function loadCompanies() {
            companyService.getAllCompanies().then(
                  function (response) {
                      $scope.companies = response;
                      loadEmployees();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }
        function loadEmployees() {
            employeeService.getAllEmployees().then(
                  function (response) {
                      $scope.allEmployees = response;
                      $scope.employees = response;
                      loadDocumentRenewalStatuss();
                  },
                function (data) {
                    if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function getCompanyById(Id) {
            var _companyName;
            for (var i = 0; i < $scope.companies.length; i++) {
                if ($scope.companies[i].CompanyID === Id) {
                    _companyName = $scope.companies[i].CompanyName
                    break;
                }
            }
            return _companyName;
        }
        function getEmployeesById(Id) {
            var _employeeName;
            for (var i = 0; i < $scope.allEmployees.length; i++) {
                if ($scope.allEmployees[i].EmployeeID === Id) {
                    _employeeName = $scope.allEmployees[i].EmployeeName
                    break;
                }
            }
            return _employeeName;
        }
        
        function getDocumentRenewalStatusById(Id) {
            var _documentRenewalStatusName;
            for (var i = 0; i < $scope.documentRenewalStatus.length; i++) {
                if ($scope.documentRenewalStatus[i].DocumentRenewalStatusID === Id) {
                    _documentRenewalStatusName = $scope.documentRenewalStatus[i].DocumentRenewalStatusName
                    break;
                }
            }
            return _documentRenewalStatusName;
        }
        
        function getDocumentCategoryById(Id) {
            var _documentCategoryName;
            for (var i = 0; i < $scope.documentCategories.length; i++) {
                if ($scope.documentCategories[i].DocumentCategoryID === Id) {
                    _documentCategoryName = $scope.documentCategories[i].DocumentCategoryName
                    break;
                }
            }
            return _documentCategoryName;
        }
        function getDocumentTypeById(Id) {
            var _documentTypeName;
            for (var i = 0; i < $scope.documentTypes.length; i++) {
                if ($scope.documentTypes[i].DocumentTypeID === Id) {
                    _documentTypeName = $scope.documentTypes[i].DocumentTypeName
                    break;
                }
            }
            return _documentTypeName;
        }
        $scope.setCompany = function (ID, Name) {
            $scope.employees = getEmployeeByCompanyID(ID, $scope.allEmployees);
            $scope.document.CompanyID = ID;
            $scope.selectedCompanyName = Name;
        }
        $scope.setEmployee = function (ID, Name) {
            $scope.document.EmployeeID = ID;
            $scope.selectedEmployeeName = Name;
        }
        $scope.setOwner = function (ID, Name) {
            $scope.document.EmployeeID = ID;
            $scope.selectedOwnerName = Name;
        }
        $scope.setProcessOwner= function (ID, Name) {
            $scope.document.ProcessOwnerID = ID;
            $scope.selectedProcessOwnerName = Name;
        }
        $scope.setDocumentCategory = function (ID, Name) {
            $scope.document.DocumentCategoryID = ID;
            $scope.selectedDocumentCategoryName = Name;
        }
        $scope.setDocumentType = function (ID, Name) {
            $scope.document.DocumentTypeID = ID;
            $scope.selectedDocumentTypeName = Name;
        }
        $scope.setDocumentRenewalStatus = function (ID, Name) {
            $scope.document.DocumentRenewalStatusID = ID;
            $scope.selectedDocumentRenewalStatusName = Name;
        }



        ////////////////////////// Participants /////////////////////////


        $scope.participant = {
            DocumentID: 0
        };
        $scope.participants = new Array();
        $scope.selectedParticipants = new Array();
        $scope.updateParticipant = function () {
            var _participants = new Array();
            if ($scope.selectedParticipants.length > 0) {
                for (var i = 0; i < $scope.selectedParticipants.length; i++) {
                    _participants.push({ 'EmployeeID': $scope.selectedParticipants[i], 'DocumentID': $scope.participant.DocumentID });
                }
            }
            else {
                _participants.push({ 'EmployeeID': 0, 'DocumentID': $scope.participant.DocumentID });
            }
            return _participants;
            //appointmentService.updateParticipant(_participants).then(
            //    function (response) {
            //        if (response.data == true) {
            //            addNotification('Success', 'Participants successfully updated!', 'success');
            //            for (var i = 0; i < $scope.selectedParticipants.length; i++) {
            //                removeParticipantFromList($scope.selectedParticipants[i]);
            //            }
            //            clearDropDowns();
            //            $scope.participant.DocumentID = 0;
            //            loadParticipants();
            //        }
            //        else {
            //            var _employees = new Array();
            //            for (var i = 0; i < response.data.length; i++) {
            //                var appointment = getAppointmentById(response.data[i].DocumentID);
            //                _employees.push((i + 1) + ' - ' + getEmployeesById(response.data[i].EmployeeID) + ' (' + appointment.StartTime + ' - ' + appointment.EndTime + ')' + '\n');
            //                removeParticipantFromList(response.data[i].EmployeeID);
            //            }
            //            addNotification('Warning', 'Following Employee(s) are busy with another Appointment! \n ' + _employees, 'warning');
            //        }
            //    },
            // function (data) {
            //     if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
            // });
        };
        $scope.toggleParticipant = function (employeeID, employeeName) {
            var _anchor = $('.checkbox-container[data-employeeID=' + employeeID + ']').parents('a');
            if (_anchor.find('input[type=checkbox]').is(':checked')) {
                removeParticipantFromList(employeeID);
            }
            else {
                addParticipantToList(employeeID, _anchor)
            }
            if ($scope.selectedParticipants.length == 0) {
                $scope.document.ParticipantID = undefined;
            }
            else {
                $scope.document.ParticipantID = 1;
            }
        }

        $('.participant-list').on('click', 'ul li > span', function () {
            removeParticipantFromList($(this).first().attr('employeeID'));
        });

        function addParticipantToList(employeeID, _anchor) {
            if ($scope.selectedParticipants.indexOf(employeeID) == -1) {
                _anchor.find('input[type=checkbox]').prop('checked', true);
                var employeeName = _anchor.text();
                $scope.selectedParticipants.push(employeeID);
                $scope.document.ParticipantID = 1;
                $('.participant-list ul').append('<li  employeeID="' + employeeID + '"><span data-employeeID="' + employeeID + '" onclick="removeParticipantFromList("' + employeeID + '");" employeeID="' + employeeID + '" >X</span>' + employeeName + '</li>');
                _anchor.find('.checkbox-container').addClass('checked').removeClass('unchecked');
            }
        }
        function getParticipantById(Id) {
            var _participant;
            for (var i = 0; i < $scope.participants.length; i++) {
                if ($scope.participants[i].ParticipantID === Id) {
                    _participant = $scope.participants[i]
                    break;
                }
            }
            return _participant;
        }
        function removeParticipantFromList(employeeID) {
            var _anchor = $('.checkbox-container[data-employeeID=' + employeeID + ']').parents('a');
            $('.participant-list ul li').each(function (k, elm) {
                if ($(elm).attr('employeeID') == employeeID) {
                    _anchor.find('input[type=checkbox]').prop('checked', false);
                    $('.participant-list ul li').eq(k).remove();
                    _anchor.find('.checkbox-container').removeClass('checked').addClass('unchecked');
                }
            });
            for (var i = 0; i < $scope.selectedParticipants.length; i++) {
                if ($scope.selectedParticipants[i] == employeeID) {
                    $scope.selectedParticipants.splice(i, 1);
                }
            }
        }

       


        ///////////////////////////////Document Type ///////////////////////////////

        var isUpdateDataTable = false;
        var tblDocumentType;
        $scope.documentType = {
            DocumentTypeID: 0,
            DocumentTypeName: '',
            Remarks: ''
        }
        $scope.isCreate = false;
        $scope.message = "";

        $scope.triggerCreate = function () {
            $scope.isCreate = true;
            $scope.documentType.DocumentTypeName = '';
            $scope.documentType.Remarks = '';
            $('#mdlDocumentType').modal("show");
            angular.forEach($scope.frmDocumentType.$error.required, function (field) {
                field.$valid = true;
            });
        }
        
        function loadDocumentTypes() {

            documentService.getAllDocumentTypes().then(
                   function (response) {
                           if ($.fn.dataTable.isDataTable('#tblDocumentType')) {
                               $('#tblDocumentType').DataTable().destroy();
                           }
                           if (window.location.href.toLowerCase().indexOf('documenttype') == -1) {
                               $scope.documentTypes = response;
                               loadCompanies();
                           }
                           else {
                               tblDocumentType = $('#tblDocumentType').DataTable({
                                   data: response,
                                   "order": [[1, "asc"]],
                                   "columns": [
                                        { "data": "DocumentTypeID" },
                                        { "data": "DocumentTypeName" },
                                        { "data": "Remarks" }
                                   ],
                                   "columnDefs": [
                                        {
                                            "render": function (data, type, row) {
                                                return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                            },
                                            "targets": 0
                                        },
                                   ],
                                   "rowCallback": function (row, data) {
                                   }
                               });
                               

                           }
                           
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblDocumentType').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblDocumentType').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.documentType.DocumentTypeID = rowData.DocumentTypeID;
                    $scope.documentType.DocumentTypeName = rowData.DocumentTypeName;
                    $scope.documentType.Remarks = rowData.Remarks;
                    $scope.isCreate = false;
                });
                $('#mdlDocumentType').modal("show");
            }
        });
        $('#tblDocumentType').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.documentType.DocumentTypeID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlDocumentTypeDelete').modal("show");
        });
        $scope.createDocumentType = function () {
            if (isFormValid($scope.frmDocumentType)) {
                $scope.$parent.isNameExist('Document', 0, 'type', $scope.documentType.DocumentTypeName).then(function(response){
                if(response.data)   addNotification('Error', 'Document Type with same name already exists!', 'error');
                else{
                    documentService.createDocumentType($scope.documentType).then(
                            function (response) {
                                addNotification('Success', 'New record is added in Document Type!', 'success');
                                $('#mdlDocumentType').modal("hide");
                                loadDocumentTypes();
                            },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlDocumentType').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDocumentType').modal("hide");
                });
            }
        };


        $scope.updateDocumentType = function () {
            if (isFormValid($scope.frmDocumentType)) {
                $scope.$parent.isNameExist('Document', $scope.documentType.DocumentTypeID, 'type', $scope.documentType.DocumentTypeName).then(function (response) {
                    if (response.data) addNotification('Error', 'Document Type with same name already exists!', 'error');
                    else {
                        documentService.updateDocumentType($scope.documentType).then(
                                function (response) {
                                    addNotification('Success', 'Record is successfully updated!', 'success');
                                    $('#mdlDocumentType').modal("hide");
                                    loadDocumentTypes();
                                },
                                function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                    $('#mdlDocumentType').modal("hide");
                                });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDocumentType').modal("hide");
                });
            }
        };


        $scope.deleteDocumentType = function () {
            documentService.deleteDocumentType($scope.documentType.DocumentTypeID).then(
                function (response) {
                    loadDocumentTypes();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

        ///////////////////////////////Document Category ///////////////////////////////

        var tblDocumentCategory;
        $scope.documentCategory = {
            DocumentCategoryID: 0,
            DocumentCategoryName: '',
            Remarks: ''
        }
        $scope.isCreateDocumentCategory = false;
        $scope.triggerCreateDocumentCategory = function () {
            $scope.isCreateDocumentCategory = true;
            $scope.documentCategory.DocumentCategoryName = '';
            $scope.documentCategory.Remarks = '';
            $('#mdlDocumentCategory').modal("show");
            angular.forEach($scope.frmDocumentCategory.$error.required, function (field) {
                field.$valid = true;
            });
        }
        function loadDocumentCategorys() {

            documentService.getAllDocumentCategory().then(
                   function (response) {
                       if (window.location.href.toLowerCase().indexOf('categor') == -1) {
                           $scope.documentCategories = response;
                           loadDocumentTypes();
                       }
                       else {
                       if ($.fn.dataTable.isDataTable('#tblDocumentCategory')) {
                                $('#tblDocumentCategory').DataTable().destroy();
                           }
                          tblDocumentCategory = $('#tblDocumentCategory').DataTable({
                              data: response,
                              "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "DocumentCategoryID" },
                                    { "data": "DocumentCategoryName" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                        {
                                            "render": function (data, type, row) {
                                                return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                            },
                                            "targets": 0
                                        },
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                              

                       }
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });


        }
        $('#tblDocumentCategory').on('click', 'tbody tr i.edit', function () {
            var rowData = $('#tblDocumentCategory').DataTable().row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.documentCategory.DocumentCategoryID = rowData.DocumentCategoryID;
                    $scope.documentCategory.DocumentCategoryName = rowData.DocumentCategoryName;
                    $scope.documentCategory.Remarks = rowData.Remarks;
                    $scope.isCreateDocumentCategory = false;
                });
                $('#mdlDocumentCategory').modal("show");
            }
        });
       
        $('#tblDocumentCategory').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.documentCategory.DocumentCategoryID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlDocumentCategoryDelete').modal("show");
        });
        $scope.createDocumentCategory = function () {
            if (isFormValid($scope.frmDocumentCategory)) {
                $scope.$parent.isNameExist('Document', 0, 'category', $scope.documentCategory.DocumentCategoryName).then(function (response) {
                    if (response.data) addNotification('Error', 'Document Category with same name already exists!', 'error');
                    else {
                        documentService.createDocumentCategory($scope.documentCategory).then(
                                function (response) {
                                    addNotification('Success', 'New record is added in Document Category!', 'success');
                                    $('#mdlDocumentCategory').modal("hide");
                                    loadDocumentCategorys();
                                },
                                function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                    $('#mdlDocumentCategory').modal("hide");
                                });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDocumentCategory').modal("hide");
                });
            }
        };

        $scope.updateDocumentCategory = function () {
            if (isFormValid($scope.frmDocumentCategory)) {
                $scope.$parent.isNameExist('Document', $scope.documentCategory.DocumentCategoryID, 'category', $scope.documentCategory.DocumentCategoryName).then(function (response) {
                    if (response.data) addNotification('Error', 'Document Category with same name already exists!', 'error');
                    else {
                        documentService.updateDocumentCategory($scope.documentCategory).then(
                                function (response) {
                                    addNotification('Success', 'Record is successfully updated!', 'success');
                                    $('#mdlDocumentCategory').modal("hide");
                                    loadDocumentCategorys();
                                },
                                function (data) {
                                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                    $('#mdlDocumentCategory').modal("hide");
                                });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDocumentCategory').modal("hide");
                });
            }
        };

        $scope.deleteDocumentCategory = function () {
            documentService.deleteDocumentCategory($scope.documentCategory.DocumentCategoryID).then(
                function (response) {
                    loadDocumentCategorys();
                },
             function (data) {
                 $scope.message = data.error_description;
             });
        };

        /////////////////////////////// Document Renewal Status /////////////////////////

        var tblDocumentRenewalStatus;
        $scope.documentRenewalStatus = {
            DocumentRenewalStatusID: 0,
            DocumentRenewalStatusName: '',
            ShortForm: '',
            Currency: '',
            Remarks: ''
        }
        $scope.isCreateDocumentRenewalStatus = false;

        $scope.triggerCreateDocumentRenewalStatus = function () {
            $scope.isCreateDocumentRenewalStatus = true;
            $scope.documentRenewalStatus.DocumentRenewalStatusName = '';
            $scope.documentRenewalStatus.Remarks = '';
            $('#mdlDocumentRenewalStatus').modal("show");
            angular.forEach($scope.frmDocumentRenewalStatus.$error.required, function (field) {
                field.$valid = true;
            });
        }
        function loadDocumentRenewalStatuss() {
            documentService.getAllDocumentRenewalStatus().then(
                   function (response) {
                       if (window.location.href.toLowerCase().indexOf('renewalstatus') == -1){
                           $scope.documentRenewalStatus = response;
                           loadDocuments();
                       }
                       else{
                           if ($.fn.dataTable.isDataTable('#tblDocumentRenewalStatus')) {
                               $('#tblDocumentRenewalStatus').DataTable().destroy();
                           }
                           tblDocumentRenewalStatus = $('#tblDocumentRenewalStatus').DataTable({
                               data: response,
                               "order": [[1, "asc"]],
                               "columns": [
                                    { "data": "DocumentRenewalStatusID" },
                                    { "data": "DocumentRenewalStatusName" },
                                    { "data": "Remarks" }
                               ],
                               "columnDefs": [
                                            {
                                                "render": function (data, type, row) {
                                                    return '<i class="glyphicon glyphicon-edit edit"></i> / <i class="glyphicon delete glyphicon-remove-circle" ID="' + data + '"></i>';
                                                },
                                                "targets": 0
                                            },
                               ],
                               "rowCallback": function (row, data) {
                               }
                           });
                       }
                   },
                function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });

        }
        $('#tblDocumentRenewalStatus').on('click', 'tbody tr i.edit', function () {
            var rowData = tblDocumentRenewalStatus.row($(this).parents('tr')).data();
            if (rowData != undefined) {
                $scope.$apply(function () {
                    $scope.documentRenewalStatus.DocumentRenewalStatusID = rowData.DocumentRenewalStatusID;
                    $scope.documentRenewalStatus.DocumentRenewalStatusName = rowData.DocumentRenewalStatusName;
                    $scope.documentRenewalStatus.Remarks = rowData.Remarks;
                    $scope.isCreateDocumentRenewalStatus = false;
                });
                $('#mdlDocumentRenewalStatus').modal("show");
            }
        });
        $('#tblDocumentRenewalStatus').on('click', 'tbody tr i.delete', function () {
            var _ID = $(this).attr('ID');
            var _deleteName = $(this).parents('tr').find('td:nth-child(2)').text();
            $scope.$apply(function () {
                $scope.documentRenewalStatus.DocumentRenewalStatusID = _ID;
                $scope.deleteName = _deleteName;
            });
            $('#mdlDocumentRenewalStatusDelete').modal("show");
        });

        $scope.createDocumentRenewalStatus = function () {
            if (isFormValid($scope.frmDocumentRenewalStatus)) {
                $scope.$parent.isNameExist('Document', 0, 'renewal', $scope.documentRenewalStatus.DocumentRenewalStatusName).then(function(response){
                    if (response.data) addNotification('Error', 'Document Renewal Status with same name already exists!', 'error');
                    else{
                        documentService.createDocumentRenewalStatus($scope.documentRenewalStatus).then(
                           function (response) {
                               addNotification('Success', 'New record is added in Document Renewal Status!', 'success');
                               $('#mdlDocumentRenewalStatus').modal("hide");
                               loadDocumentRenewalStatuss();
                           },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlDocumentRenewalStatus').modal("hide");
                            });
                    }
                },function(response){
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDocumentRenewalStatus').modal("hide");
                });
            }
        };


        $scope.updateDocumentRenewalStatus = function () {
            if (isFormValid($scope.frmDocumentRenewalStatus)) {
                $scope.$parent.isNameExist('Document', $scope.documentRenewalStatus.DocumentRenewalStatusID, 'renewal', $scope.documentRenewalStatus.DocumentRenewalStatusName).then(function (response) {
                    if (response.data) addNotification('Error', 'Document Renewal Status with same name already exists!', 'error');
                    else {
                        documentService.updateDocumentRenewalStatus($scope.documentRenewalStatus).then(
                           function (response) {
                               addNotification('Success', 'Record is successfully updated!', 'success');
                               $('#mdlDocumentRenewalStatus').modal("hide");
                               loadDocumentRenewalStatuss();
                           },
                            function (data) {
                             if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                                $('#mdlDocumentRenewalStatus').modal("hide");
                            });
                    }
                }, function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    $('#mdlDocumentRenewalStatus').modal("hide");
                });
            }
        };


        $scope.deleteDocumentRenewalStatus = function () {
            documentService.deleteDocumentRenewalStatus($scope.documentRenewalStatus.DocumentRenewalStatusID).then(
                function (response) {
                    loadDocumentRenewalStatuss();
                },
             function (data) {
                 if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
             });
        };

        
        function clearDropDowns() {
            $scope.selectedRegionName = "Select Region";
            $scope.selectedLocationName = "Select Location";
            $scope.selectedOwnerName = "Select Owner";
            $scope.selectedParticipantName = "Select Authorized People";
            $scope.selectedProcessOwnerName = "Select Process Owner";
            $scope.selectedEmployeeName = "Select Employee";
            $scope.selectedCompanyName = "Select Company";
            $scope.selectedDocumentTypeName = "Select Document Type";
            $scope.selectedDocumentCategoryName = "Select Document Category";
            $scope.selectedDocumentRenewalStatusName = "Select Renewal Status";
        }

        function isDropDownsValid(frm, model) {
            var _result = true;
            if (model.EmployeeID == undefined) {
                frm.txtEmployeeID.$dirty = true;
                _result = false;
            }
           
            if (model.ProcessOwnerID == undefined) {
                frm.txtProcessOwnerID.$dirty = true;
                _result = false;
            } 
            if (model.ParticipantID == undefined) {
                frm.txtParticipantID.$dirty = true;
                _result = false;
            }
            if (model.CompanyID == undefined) {
                frm.txtCompanyID.$dirty = true;
                _result = false;
            }
            if (model.DocumentTypeID == undefined) {
                frm.txtDocumentTypeID.$dirty = true;
                _result = false;
            }
            if (model.DocumentCategoryID == undefined) {
                frm.txtDocumentCategoryID.$dirty = true;
                _result = false;
            }
            if (model.DocumentRenewalStatusID == undefined) {
                frm.txtDocumentRenewalStatusID.$dirty = true;
                _result = false;
            }
            if (model.FileLocation == undefined) {
                angular.element('#txtFileLocation').addClass('border-red');
                angular.element('#txtFileLocation').next('span').removeClass('hide');
                _result = false;
            }
            if (!isFormValid(frm)) {
                _result = false;
            }
            return _result;
        }
    }
})();