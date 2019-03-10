(function () {
    'use strict';

    angular
        .module('HRMS').directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    if (element.hasClass('is-image')) {
                        var image = new Image();
                        image.onload = function () {
                            if (changeEvent.target.files[0].size > 528385) {
                                addNotification('Warning', 'Image Size should not be greater than 500Kb!', 'warning');
                                scope.$apply(function () {
                                    scope.fileread = '';
                                });
                                element.val('');
                                return false;
                            }
                            else {
                                scope.$apply(function () {
                                    scope.fileread = loadEvent.target.result;
                                });
                            }
                        };
                        image.onerror = function () {
                            addNotification('Error', 'Please upload a valid image!', 'error');
                            scope.$apply(function () {
                                scope.fileread = '';
                            });
                            element.val('');
                        };
                        var url = window.URL || window.webkitURL;
                        image.src = url.createObjectURL(changeEvent.target.files[0]);
                    }
                    else {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                  
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
        }]);

    angular
   .module('HRMS').directive("datepicker", [function () {
       return {
           link: function (scope, element, attributes) {
               element.daterangepicker({locale: {format: 'DD/MM/YYYY'}, singleDatePicker: !0, singleClasses: "picker_1",showDropdowns: true }, function (a, b, c) {  });
           }
       }
   }]);

    angular
    .module('HRMS').directive("clockpicker", [function () {
        return {
            //scope: {
            //    fileread: "="
            //},
            link: function (scope, element, attributes) {
                element.clockpicker({
                    autoclose: true,
                   // donetext: 'Done',
                    init: function () {
                        
                    },
                    beforeShow: function () {
                    },
                    afterShow: function () {
                    },
                    beforeHide: function () {
                    },
                    afterHide: function () {
                    },
                    beforeHourSelect: function () {
                    },
                    afterHourSelect: function () {
                    },
                    beforeDone: function () {
                    },
                    afterDone: function (e) {
                       
                    }
                }).change(function () {

                    if ($(this).attr('id') == 'txtStartTime' || $(this).attr('id') == 'txtEndTime') {
                        if (scope.shift.StartTime != '' && scope.shift.EndTime != '') {
                            var miliseconds = moment(scope.shift.EndTime, "HH:mm:ss").diff(moment(scope.shift.StartTime, "HH:mm:ss"));
                            var duration = moment.duration(miliseconds);
                            var difference = Math.floor(duration.asHours()) + moment.utc(miliseconds).format(":mm");
                            if (miliseconds < 3600000) {
                                addNotification('Error', 'Shift cannot be less then one hour!', 'error');
                                // error
                            }
                            else {
                                scope.$apply(function () {
                                    scope.shift.TotalTime = difference;
                                });
                                //if ($(this).attr('id') == 'txtBreakStartTime' || $(this).attr('id') == 'txtBreakEndTime') {
                                    breakDifference();
                                //}
                            }
                        }
                    }

                    else if ($(this).attr('id') == 'txtBreakStartTime' || $(this).attr('id') == 'txtBreakEndTime') {
                        breakDifference();
                    }
                    //else if ($(this).attr('id') == 'txtAttendenceTimeIn' || $(this).attr('id') == 'txtAttendenceTimeOut') {
                    //    scope.timeChange();
                    //}
                    
                    function breakDifference() {
                        if (scope.shift.BreakStartTime != '' && scope.shift.BreakEndTime != '') {
                            var miliseconds = moment(scope.shift.BreakEndTime, "HH:mm:ss").diff(moment(scope.shift.BreakStartTime, "HH:mm:ss"));
                            var duration = moment.duration(miliseconds);
                            var breakDifference = Math.floor(duration.asHours()) + moment.utc(miliseconds).format(":mm");
                            if (miliseconds < 0) {
                                addNotification('Error', 'Break start time cannot be greater than Break end time!', 'error');
                                // error
                            }
                            else {
                                scope.$apply(function () {
                                    scope.shift.TotalBreakHours = breakDifference;
                                });
                                if (scope.shift.TotalTime != '') {
                                    var miliseconds = moment(scope.shift.TotalTime, "HH:mm:ss").diff(moment(breakDifference, "HH:mm:ss"));
                                    var duration = moment.duration(miliseconds);
                                    var workingDifference = Math.floor(duration.asHours()) + moment.utc(miliseconds).format(":mm");
                                }
                                scope.$apply(function () {
                                    scope.shift.TotalWorkingHours = workingDifference;
                                });
                            }
                        }
                    }

                });
            }
        }
    }]);
})();