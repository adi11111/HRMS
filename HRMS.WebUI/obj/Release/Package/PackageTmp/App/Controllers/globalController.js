(function () {
    'use strict';

    angular
        .module('HRMS')
        .controller('globalController', globalController);

    globalController.$inject = ['$scope', '$location', 'documentService', 'appointmentService', 'employeeService', 'companyService', '$http', '$q'];

    function globalController($scope, $location, documentService, appointmentService,employeeService,companyService , $http,$q) {
        $scope.$on('$viewContentLoaded', onLoaded);
        $scope.$on('viewContentLoadComplete', onLoadComplete);
        //$scope.dashboardLoaded = false;
        function onLoaded() {
            $scope.$broadcast('viewContentLoadComplete');
            $('.ui-pnotify').remove();
            if ($('#drpNotification #menu1').length < 1) {
                loadNotifications();
            }
            //if ($scope.dashboardLoaded == false) {
            if (window.location.href.toLowerCase().indexOf('/') == -1) {
                loadHome();
            }
            else if (window.location.href.toLowerCase().split('/')[window.location.href.toLowerCase().split('/').length - 1].length < 4) {
                //$scope.dashboardLoaded = true;
                loadHome();
            }
            $scope.isPayslipReport = false;
            $scope.drpCompany = false;
            if (window.location.href.toLowerCase().indexOf('report') > -1) {
                loadEmployees();
                if (window.location.href.toLowerCase().indexOf('payslip') > -1 || window.location.href.toLowerCase().indexOf('gratuity') > -1) {
                    $scope.isPayslipReport = true;
                    $scope.drpCompany = true;
                }
                else if (window.location.href.toLowerCase().indexOf('salaryschedule') > -1) {
                    $scope.drpCompany = true;
                }
            }
            $('#reportName').html(window.location.href.split('#')[1].replace('/', '').replace('Report', '') + $('#reportName').html());
        }
        
        function onLoadComplete() {
        }

        $scope.Global = {
            logOut : function () {
                AuthService.logOut();
                $scope.Global.isAuthenticated = false;
                $location.path('/Account/Login');
            },
          //  isAuthenticated: AuthService.isAuthenticated()
        }

        /////////////////////////////// Common ///////////////////////////////

        $scope.home = new Object();
        function loadHome() {
            var _url = '/Home/GetHomeDetail';
            if ($('#adminRole').length > 0) {
                $scope.adminRole = true;
                _url = '/Home/GetAdminHomeDetail';
            }
            else {
                $scope.adminRole = false;
            }
           
                $http.post(_url)
                  .then(function (response) {
                      var _totalEmployees = new Array();
                      var _employees = response.data;
                      var _branchNames = new Array();
                      if ($scope.adminRole) {
                          var _branches = getValueByKey(_employees, 'Branches');// response.data.Branches;
                          $scope.home.Lable1Title = 'Total Employees';
                          $scope.home.Lable2Title = 'Total Males';
                          $scope.home.Lable3Title = 'Total Females';
                          $scope.home.Lable4Title = 'Total Employees Taken Leave';
                          $scope.home.Lable5Title = 'Total Active';
                          $scope.home.Lable6Title = 'Total Total InActive';
                          $scope.home.Lable1SubTitle = 'All Branches';
                          $scope.home.Lable2SubTitle = 'All Branches';
                          $scope.home.Lable3SubTitle = 'All Branches';
                          $scope.home.Lable4SubTitle = 'All Branches';
                          $scope.home.Lable5SubTitle = 'All Branches';
                          $scope.home.Lable6SubTitle = 'All Branches';
                          $scope.home.BranchTitle = 'Total Employees ';
                          $scope.home.BranchSubTitle = 'Country Wise';
                          $scope.home.LeaveTitle = 'All Employees Leave Balance';
                          $scope.home.LeaveSubTitle = 'Current Year';
                          var _branchSalary = response.data.BranchSalary;
                          if (_branches != undefined) {
                              for (var i = 0; i < _branches.length; i++) {
                                  _branchNames.push(_branches[i].BranchName);
                                  _totalEmployees.push(_branches[i].TotalEmployees);
                              }
                          }
                          $scope.home.TotalEmployees = getValueByKey(_employees, 'TotalEmployees');
                          $scope.home.TotalMales = getValueByKey(_employees, 'TotalMales');
                          $scope.home.TotalFemales = getValueByKey(_employees, 'TotalFemales');
                          $scope.home.TotalActive = getValueByKey(_employees, 'TotalActive');
                          $scope.home.TotalInActive = getValueByKey(_employees, 'TotalInActive');
                          $scope.home.TotalLeaveApplied = getValueByKey(_employees, 'TotalLeaveApplied');
                          $scope.home.TotalMalesPercentage = getValueByKey(_employees, 'TotalMalesPercentage');
                          $scope.home.TotalFemalesPercentage = getValueByKey(_employees, 'TotalFemalesPercentage');
                          $scope.home.TotalActivePercentage = getValueByKey(_employees, 'TotalActivePercentage');
                          $scope.home.TotalInActivePercentage = getValueByKey(_employees, 'TotalInActivePercentage');
                          $scope.home.TotalLeavesPercentage = getValueByKey(_employees, 'TotalLeavesPercentage');
                          $scope.home.Appointments = getValueByKey(_employees, 'Appointments');
                          $scope.home.IssueDocuments = getValueByKey(_employees, 'IssueDocuments');
                          $scope.home.ExpiryDocuments = getValueByKey(_employees, 'ExpiryDocuments');
                      }
                      else {
                          $scope.home.Lable1Title = 'Total Current Leave Pending';
                          $scope.home.Lable2Title = 'Total Sick Leave Pending';
                          $scope.home.Lable3Title = 'Total Leave Taken';
                          $scope.home.Lable4Title = 'Total Leave Applied';
                          $scope.home.Lable5Title = 'Total Days Absent';
                          $scope.home.Lable6Title = 'Total Gratuity';
                          $scope.home.Lable1SubTitle = 'As of Today';
                          $scope.home.Lable2SubTitle = 'Current Year';
                          $scope.home.Lable3SubTitle = 'Current Year';
                          $scope.home.Lable4SubTitle = 'Current Year';
                          $scope.home.Lable5SubTitle = 'Current Year';
                          $scope.home.Lable6SubTitle = 'As of Current Month';
                          $scope.home.BranchTitle = 'Total Leaves';
                          $scope.home.BranchSubTitle = 'Current Year';
                          $scope.home.LeaveTitle = 'Leave Balance';
                          $scope.home.LeaveSubTitle = 'Current Year';
                          $scope.home.TotalCurrentLeavesPending = getValueByKey(_employees, 'TotalCurrentLeavesPending');
                          $scope.home.TotalAnnualLeavesPending = getValueByKey(_employees, 'TotalAnnualLeavesPending');
                          $scope.home.TotalSickLeavesPending = getValueByKey(_employees, 'TotalSickLeavesPending');
                          $scope.home.TotalLeavesTaken = getValueByKey(_employees, 'TotalLeavesTaken');
                          $scope.home.TotalLeavesApplied = getValueByKey(_employees, 'TotalLeavesApplied');
                          $scope.home.TotalLeaveApplied = getValueByKey(_employees, 'TotalLeaveApplied');
                          $scope.home.TotalDaysAbsent = getValueByKey(_employees, 'TotalDaysAbsent');
                          $scope.home.TotalGraduity = getValueByKey(_employees, 'TotalGraduity');
                          $scope.home.TotalEmployees = getValueByKey(_employees, 'TotalEmployees');
                          var _leaves = getValueByKey(_employees, 'LeavesYearly');
                          if (_leaves != undefined) {
                              var _totalLeaves = 0;
                              for (var i = 0; i < _leaves.length; i++) {
                                   _totalLeaves += _leaves[i].TotalLeaves;
                              }
                              $scope.home.TotalLeaves = _totalLeaves;
                          }
                          //$scope.home.TotalLeaveBalancePercentage = getValueByKey(_employees, 'TotalLeaveBalancePercentage');
                          //$scope.home.TotalDaysPresentPercentage = getValueByKey(_employees, 'TotalDaysPresentPercentage');
                          //$scope.home.TotalDaysOnLeavePercentage = getValueByKey(_employees, 'TotalDaysOnLeavePercentage');
                          //$scope.home.TotalLeaveApprovedPercentage = getValueByKey(_employees, 'TotalLeaveApprovedPercentage');
                          //$scope.home.TotalLeavePendingPercentage = getValueByKey(_employees, 'TotalLeavePendingPercentage');
                          _branches = getValueByKey(_employees, 'LeavesYearly');
                          $scope.home.Appointments = getValueByKey(_employees, 'Appointments');
                          $scope.home.IssueDocuments = getValueByKey(_employees, 'IssueDocuments');
                          $scope.home.ExpiryDocuments = getValueByKey(_employees, 'ExpiryDocuments');
                          _branchNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                          if (_branches != undefined) {
                              for (var i = 0; i < _branches.length; i++) {
                                  _totalEmployees.push(_branches[i].TotalLeaves);
                              }
                          }
                      }
                      loadHomeData(_employees,_branchNames,_totalEmployees);
                  },
                    function (response) {
                        if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                    });
        }

        function getValueByKey(list,key) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].Key == key) {
                    return list[i].Value;
                    break;
                }
            }
            return '';
        }

        function loadHomeData(employees, branchNames, totalEmployees) {
            var _graph = new Graphs();
            _graph.showBranchGraph(branchNames, totalEmployees);
            _graph.showLeaveChart();
            _graph.showAppointmentGraph();
            _graph.showDocumentGraph();
        }

        function Graphs() {
            var theme = {
                color: [
                    '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
                    '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
                ],

                title: {
                    itemGap: 8,
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#408829'
                    }
                },

                dataRange: {
                    color: ['#1f610a', '#97b58d']
                },

                toolbox: {
                    color: ['#408829', '#408829', '#408829', '#408829']
                },

                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#408829',
                            type: 'dashed'
                        },
                        crossStyle: {
                            color: '#408829'
                        },
                        shadowStyle: {
                            color: 'rgba(200,200,200,0.3)'
                        }
                    }
                },

                dataZoom: {
                    dataBackgroundColor: '#eee',
                    fillerColor: 'rgba(64,136,41,0.2)',
                    handleColor: '#408829'
                },
                grid: {
                    borderWidth: 0
                },

                categoryAxis: {
                    axisLine: {
                        lineStyle: {
                            color: '#408829'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#eee']
                        }
                    }
                },

                valueAxis: {
                    axisLine: {
                        lineStyle: {
                            color: '#408829'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#eee']
                        }
                    }
                },
                timeline: {
                    lineStyle: {
                        color: '#408829'
                    },
                    controlStyle: {
                        normal: { color: '#408829' },
                        HRMShasis: { color: '#408829' }
                    }
                },

                k: {
                    itemStyle: {
                        normal: {
                            color: '#68a54a',
                            color0: '#a9cba2',
                            lineStyle: {
                                width: 1,
                                color: '#408829',
                                color0: '#86b379'
                            }
                        }
                    }
                },
                map: {
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                color: '#ddd'
                            },
                            label: {
                                textStyle: {
                                    color: '#c12e34'
                                }
                            }
                        },
                        HRMShasis: {
                            areaStyle: {
                                color: '#99d2dd'
                            },
                            label: {
                                textStyle: {
                                    color: '#c12e34'
                                }
                            }
                        }
                    }
                },
                force: {
                    itemStyle: {
                        normal: {
                            linkStyle: {
                                strokeColor: '#408829'
                            }
                        }
                    }
                },
                chord: {
                    padding: 4,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            },
                            chordStyle: {
                                lineStyle: {
                                    width: 1,
                                    color: 'rgba(128, 128, 128, 0.5)'
                                }
                            }
                        },
                        HRMShasis: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            },
                            chordStyle: {
                                lineStyle: {
                                    width: 1,
                                    color: 'rgba(128, 128, 128, 0.5)'
                                }
                            }
                        }
                    }
                },
                gauge: {
                    startAngle: 225,
                    endAngle: -45,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                            width: 8
                        }
                    },
                    axisTick: {
                        splitNumber: 10,
                        length: 12,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'auto'
                        }
                    },
                    splitLine: {
                        length: 18,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    pointer: {
                        length: '90%',
                        color: 'auto'
                    },
                    title: {
                        textStyle: {
                            color: '#333'
                        }
                    },
                    detail: {
                        textStyle: {
                            color: 'auto'
                        }
                    }
                },
                textStyle: {
                    fontFamily: 'Arial, Verdana, sans-serif'
                }
            };

            this.showBranchGraph =  function (branchNames, totalEmployees) {
                if ($('#branchChart').length) {
                    var _label = "# Of Leaves"
                    if ($scope.adminRole) {
                        _label = '# of Employees';
                    }
                    var ctx = document.getElementById("branchChart");
                    var mybarChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: branchNames,
                            datasets: [{
                                label: _label,
                                backgroundColor: "#26B99A",
                                data: totalEmployees
                            }
                            //, {
                            //    label: '# of Votes',
                            //    backgroundColor: "#03586A",
                            //    data: [41, 56, 25, 48, 72, 34, 12]
                            //}
                            ]
                        },

                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });
                }
            }

            this.showLeaveChart = function () {


                //echart Pie Collapse

                if ($('#leaveChart').length) {
                    var _totalLeaveNoApplied =  0;
                    var _totalEmployees = $scope.home.TotalEmployees.length;
                    if ($scope.home.TotalEmployees.length == undefined) {
                         _totalEmployees = $scope.home.TotalEmployees;
                         _totalLeaveNoApplied = (_totalEmployees - $scope.home.TotalLeaveApplied)
                    }
                    var echartPieCollapse = echarts.init(document.getElementById('leaveChart'), theme);
                    var _name = "Out Of Total Leaves"
                    if ($scope.adminRole) {
                        _name = 'Total Employees';
                    }
                    else {
                        _totalLeaveNoApplied = $scope.home.TotalAnnualLeavesPending;
                    }
                    echartPieCollapse.setOption({
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            x: 'center',
                            y: 'bottom',
                            data: ['Leave Applied', 'Leave Not Applied'
                            //, 'rose3', 'rose4', 'rose5', 'rose6'
                            ]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                magicType: {
                                    show: true,
                                    type: ['pie', 'funnel']
                                },
                                restore: {
                                    show: false,
                                    title: "Restore"
                                },
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        calculable: true,
                        series: [{
                            name: _name,
                            type: 'pie',
                            radius: [25, 90],
                            center: ['50%', 170],
                            roseType: 'area',
                            x: '50%',
                            max: 40,
                            sort: 'ascending',
                            data: [{
                                value: $scope.home.TotalLeaveApplied,
                                name: 'Leave \nApplied'
                            }, {
                                value: _totalLeaveNoApplied,
                                name: 'Leave Not \nApplied'
                            }
                            //, {
                            //    value: 15,
                            //    name: 'rose3'
                            //}, {
                            //    value: 25,
                            //    name: 'rose4'
                            //}, {
                            //    value: 20,
                            //    name: 'rose5'
                            //}, {
                            //    value: 35,
                            //    name: 'rose6'
                            //}
                            ]
                        }]
                    });

                }

            }

            this.showAppointmentGraph = function () {
                //echart Bar Horizontal

                if ($('#appointmentGraph').length) {

                    var echartBar = echarts.init(document.getElementById('appointmentGraph'), theme);
                    var appointemnts = $.map($scope.home.Appointments, function (v) {
                        return v.TotalAppointments;
                    });
                    echartBar.setOption({
                        title: {
                           // text: 'Appointment Graph'
                            //,subtext: 'Graph subtitle'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            x: 100,
                            data: [new Date().getFullYear()
                           // , '2016'
                            ]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {
                                    show: true,
                                    title: "Save Image"
                                }
                            }
                        },
                        calculable: true,
                        xAxis: [{
                            type: 'value',
                            boundaryGap: [0, 1]
                        }],
                        yAxis: [{
                            type: 'category',
                            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                        }],
                        series: [{
                            name: 'Appointments',
                            type: 'bar',
                            data: appointemnts
                        }
                        //, {
                        //    name: '2016',
                        //    type: 'bar',
                        //    data: [19325, 23438, 31000, 121594, 134141, 681807]
                        //}
                        ]
                    });
                }
            }

            this.showDocumentGraph = function () {
                //echart Bar

                if ($('#documentGraph').length) {

                    var echartBar = echarts.init(document.getElementById('documentGraph'), theme);

                    echartBar.setOption({
                        title: {
                           // text: 'Issues & Expires Graph'
                            //,subtext: 'Graph Sub-text'
                        },
                        color : ['#d43f3a'],
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['Issued', 'Expires']
                        },
                        toolbox: {
                            show: false
                        },
                        calculable: false,
                        xAxis: [{
                            type: 'category',
                            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                        }],
                        yAxis: [{
                            type: 'value'
                        }],
                        series: [
                        //{
                            //name: 'Issued',
                            //type: 'bar',
                            //data: $.map($scope.home.IssueDocuments, function (v) {
                            //    return v.TotalIssueDocuments;
                            //})
                            // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                            //markPoint: {
                            //    data: [{
                            //        type: 'max',
                            //        name: '???'
                            //    }, {
                            //        type: 'min',
                            //        name: '???'
                            //    }]
                            //},
                            //markLine: {
                            //    data: [{
                            //        type: 'average',
                            //        name: '???'
                            //    }]
                            //}
                        //},
                        
                        {
                            name: 'Expires',
                            type: 'bar',
                            data: $.map($scope.home.ExpiryDocuments, function (v) {
                                return v.TotalExpiryDocuments;
                            })
                            //markPoint: {
                            //    data: [{
                            //        name: 'sales',
                            //        value: 182.2,
                            //        xAxis: 7,
                            //        yAxis: 183,
                            //    }, {
                            //        name: 'purchases',
                            //        value: 2.3,
                            //        xAxis: 11,
                            //        yAxis: 3
                            //    }]
                            //},
                            //markLine: {
                            //    data: [{
                            //        type: 'average',
                            //        name: '???'
                            //    }]
                            //}
                        }
                        ]
                    });

                }

            }
        }

       

        function loadNotifications() {
           // var deferred = $q.defer();
            $http.post('/Home/GetNotifications')
                .then(function (result) {
                    //deferred.resolve(result);
                    if (result.data != undefined) {
                        if (result.data.length > 0) {
                            $('#drpNotification').append('<li role="presentation" class="dropdown">' +
                                '<a href="javascript:;" class="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false">' +
                                    '<i class="fa fa-envelope-o"></i>' +
                                    '<span class="badge bg-green">' + result.data.length + '</span>' +
                                '</a>' +
                                '<ul id="menu1" class="dropdown-menu list-unstyled msg_list" role="menu"></ul>');
                            for (var i = 0; i < result.data.length; i++) {
                                if (result.data[i].Appointment == undefined) {
                                    $('#drpNotification').find('#menu1').append(' <li>'+
                                        '<a>'+
                                            //'<span class="image"><img src="images/img.jpg" alt="Profile Image" /></span>'+
                                            '<span>'+
                                               ' <span>Upcoming Document Expiry</span>'+
                                                '<span class="time"> Date : '+ToJavaScriptDate( result.data[i].DocumentDetail.ExpiryDate ) + '</span>'+
                                            '</span>'+
                                            '<span class="message">Title :' + result.data[i].DocumentDetail.SearchName + '</span>'+
                                        '</a>'+
                                    '</li>');
                                    //addNotification( 'Upcoming Document Expiry','Title :' + result.data[i].SearchName + '\n Date : '+ result.data[i].ExpiryDate , 'warning');
                                }
                                else {
                                    $('#drpNotification').find('#menu1').append(' <li>' +
                                            '<a>' +
                                                //'<span class="image"><img src="images/img.jpg" alt="Profile Image" /></span>' +
                                                '<span>' +
                                                    '<span>Upcoming Appointment</span>' +
                                                    '<span class="time"> Date : ' + ToJavaScriptDate(result.data[i].Appointment.AppointmentDate) + '</span>' +
                                                '</span>' +
                                                '<span class="message">Title :' + result.data[i].Appointment.AppointmentName + '<br/> Time : ' +
                                                   TimespanToString(result.data[i].Appointment.StartTime) + ' - ' + TimespanToString(result.data[i].Appointment.EndTime) + '</span>' +
                                            '</a>' +
                                        '</li>');
                                    //addNotification('Upcoming Appointment', 'Title :' + result.data[i].AppointmentName + '\n Date : ' + result.data[i].AppointmentDate + '\n Time : ' +
                                    //result.data[i].StartTime + ' - ' + result.data[i].EndTime, 'warning');
                                }
                            }
                        }
                    }
                    
                },
                function (response) {
                    if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                   // deferred.reject(response);
                });


        }

        $scope.isNameExist = function(controller,id,entity,name){
            var _data = {};
            if (entity == '') {
                _data = { 'Id': id, 'Name': name.trim()  };
            }
            else {
                _data = { 'Id': id, 'Name': name.trim(), 'Entity': entity };
            }
            var deferred = $q.defer();

            $http.post('/'+controller+'/IsNameExists', _data)
                .then(function (result) {
                    deferred.resolve(result);
                },
                function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        }



        /////////////////////////////// Setting ///////////////////////////////

        //if (window.location.href.toLowerCase().indexOf('appointmentsetting') > -1) {
        //    loadAppointments();
        //}
        //else if (window.location.href.toLowerCase().indexOf('documentsetting') > -1) {
        //    loadDocuments();
        //}
        var tblSetting;
        $scope.setting = {
            SettingID: 0,
            DocumentID: 0,
            AppointmentID: 0,
            IsPopUpRequired: '',
            IsEmailRequired: '',
            PopUpDays: '',
            EmailDays: '',
            Email: '',
            CreatedByUserID: 0,
            CreatedDate : '',
            Remarks: ''
        }
        $scope.isCreateSetting = false;
        $scope.triggerCreateSetting = function () {
            $scope.isCreateSetting = true;
            $scope.setting.DocumentID = '';
            $scope.setting.AppointmentID = '';
            $scope.setting.IsPopUpRequired = '';
            $scope.setting.IsEmailRequired = '';
            $scope.setting.PopUpDays = '';
            $scope.setting.EmailDays = '';
            $scope.setting.Email = '';
            $scope.setting.Remarks = '';
            $('#mdlSetting').modal("show");
        }

        function loadSettings(type) {

            documentService.getAllSettings(type).then(
                   function (response) {
                       $scope.settings = response.data;
                       DrawSettingTable(type);
                       //if ($.fn.dataTable.isDataTable('#tblSetting')) {
                       //    $('#tblSetting').DataTable().destroy();
                       //}
                       //tblSetting = $('#tblSetting').DataTable({
                       //    data: response,
                       //    "columns": [
                       //         { "data": "SettingID" },
                       //         { "data": "DocumentID" },
                       //         { "data": "AppointmentID" },
                       //         { "data": "IsPopUpRequired" },
                       //         { "data": "IsEmailRequired" },
                       //         { "data": "PopUpDays" },
                       //         { "data": "EmailDays" },
                       //         { "data": "Email" },
                       //         { "data": "Remarks" }
                       //    ],
                       //    "columnDefs": [
                       //         { className: "hide_column", "targets": [0] },
                       //         { className: "hide_column", "targets": [8] }
                       //    ],
                       //    "rowCallback": function (row, data) {
                       //    }
                       //});
                       //$('#tblSetting').on('click', 'tbody tr', function () {
                       //    var rowData = $('#tblSetting').DataTable().row(this).data();
                       //    $scope.$apply(function () {
                       //        $scope.setting.SettingID = rowData.SettingID;
                       //        $scope.setting.DocumentID = rowData.DocumentID;
                       //        $scope.setting.AppointmentID = rowData.AppointmentID;
                       //        $scope.setting.IsPopUpRequired = rowData.IsPopUpRequired;
                       //        $scope.setting.IsEmailRequired = rowData.IsEmailRequired;
                       //        $scope.setting.PopUpDays = rowData.PopUpDays;
                       //        $scope.setting.EmailDays = rowData.EmailDays;
                       //        $scope.setting.Email = rowData.Email;
                       //        $scope.setting.Remarks = rowData.Remarks;
                       //        $scope.selectedAppointmentName = getAppointmentById(rowData.AppointmentID);
                       //        $scope.selectedDocumentName = getDocumentById(rowData.DocumentID);
                       //        $scope.isCreate = false;
                       //    });
                       //    $('#mdlSetting').modal("show");
                       //});
                   },
                function (data) {
                    $scope.message = data.error_description;
                });
        }
        $scope.updateSetting = function() {
            var _settings = new Array();
            var type = $('#tblSetting').DataTable().rows(0).data()[0][1];
            $('#tblSetting tbody tr').each(function (i) {
                var _appointmentID,_documentID;
                if (type == 0) {
                    _documentID = $('#tblSetting').DataTable().rows(i).data()[0][0];
                }
                else {
                    _appointmentID = $('#tblSetting').DataTable().rows(i).data()[0][0];
                }
                var elm = $(this);
                _settings.push({
                    'SettingID' : 0,
                    'DocumentID': _documentID,
                    'AppointmentID': _appointmentID,
                    'IsPopUpRequired': elm.find('td:nth-child(2) >  .checkbox-container').hasClass('checked'),
                    'IsEmailRequired': elm.find('td:nth-child(4) > .checkbox-container').hasClass("checked"),
                    'PopUpDays': elm.find('td:nth-child(3)').val(),
                    'EmailDays': elm.find('td:nth-child(5)').val(),
                    'Interval': elm.find('td:nth-child(6)').val(),
                });
            });
            //for (var i = 0; i < $('#tblSetting tbody tr').length; i++) {
            //    var _row = $('#tblSetting').DataTable().rows(i).data();
            //    var _setting = getSettingById(_row[i][i]);
            //    _setting.Email = _rows[i][3];
            //    _setting.Email = _rows[i][3];
            //    _setting.Email = _rows[i][3];
            //    _setting.Email = _rows[i][3];
            //}
            $http.post('/Setting/UpdateSetting', _settings)
               .then(function (result) {
                   addNotification('Success', 'Settings successfully updated!', 'success');
                   loadSettings(type);
               },
                       function (response) {
                           //deferred.reject(response);
                       });
        };
        //$scope.createSetting = function () {
        //    settingService.createSetting($scope.setting).then(
        //        function (response) {
        //            loadSettings();
        //        },
        //     function (data) {
        //         $scope.message = data.error_description;
        //     });
        //};

        //$scope.deleteSetting = function () {
        //    settingService.deleteSetting($scope.setting.SettingID).then(
        //        function (response) {
        //            loadSettings();
        //        },
        //     function (data) {
        //         $scope.message = data.error_description;
        //     });
        //};

        $scope.loadDocuments = function () {
            documentService.getAllDocument().then(
                   function (response) {
                       $scope.documents = response;
                       loadSettings(0);
                      },
                function (data) {
                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        $scope.loadAppointments = function () {
            appointmentService.getAllAppointments().then(
                  function (response) {
                      $scope.appointments = response;
                      loadSettings(1);
                  },
                function (data) {
                  if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning');} else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                });
        }

        function getAppointmentById(Id) {
            var _appointmentame;
            for (var i = 0; i < $scope.appointments.length; i++) {
                if ($scope.appointments[i].AppointmentID === Id) {
                    _appointmentame = $scope.appointments[i].AppointmentName
                    break;
                }
            }
            return _appointmentame;
        }
        function getDocumentById(Id) {
            var _documentName;
            for (var i = 0; i < $scope.documents.length; i++) {
                if ($scope.documents[i].DocumentID === Id) {
                    _documentName = $scope.documents[i].SearchName
                    break;
                }
            }
            return _documentName;
        }
        function getSettingById(Id) {
            var _setting;
            for (var i = 0; i < $scope.settings.length; i++) {
                if ($scope.settings[i].SettingID === Id) {
                    _setting = $scope.settings[i];
                    break;
                }
            }
            return _setting;
        }
        function getSettingByDocumentId(Id) {
            var _setting;
            for (var i = 0; i < $scope.settings.length; i++) {
                if ($scope.settings[i].DocumentID === Id) {
                    _setting = $scope.settings[i];
                    break;
                }
            }
            return _setting;
        }
        function getSettingByAppointmentId(Id) {
            var _setting;
            for (var i = 0; i < $scope.settings.length; i++) {
                if ($scope.settings[i].AppointmentID === Id) {
                    _setting = $scope.settings[i];
                    break;
                }
            }
            return _setting;
        }
        $scope.setAppointment = function (ID, Name) {
            $scope.setting.AppointmentID = ID;
            $scope.selectedAppointmentName = Name;
        }
        $scope.setDocument = function (ID, Name) {
            $scope.setting.DocumentID = ID;
            $scope.selectedDocumentName = Name;
        }
        $('body').on('click', '#tblSetting tr .checkbox-container', function () {
            if ($(this).hasClass('checked') == false) {
                $(this).addClass('checked');
            }
            else {
                $(this).removeClass('checked');
            }
        });
        function DrawSettingTable(type) {
            var _tbody = $('#tblSetting tbody');
            _tbody.html('');
            var _list = new Array();
            if (type == 0) {
                _list = $scope.documents;
            }
            else {
                _list = $scope.appointments;
            }
            for (var i = 0; i < _list.length; i++) {
                var _setting = '';
                var _id = undefined;
                var _name = '';
                var isPopUpRequired = '';
                var isEmailRequired = '';
                var _popUpDays = '';
                var _emailDays = '';
                var _interval = '';
                if (type == 0) {
                    _setting = getSettingByDocumentId(_list[i].DocumentID);
                    _name = getDocumentById(_list[i].DocumentID);
                    _id = _list[i].DocumentID;
                }
                else if (type == 1) {
                    _setting = getSettingByAppointmentId(_list[i].AppointmentID);
                    _name = getAppointmentById(_list[i].AppointmentID);
                    _id = _list[i].AppointmentID;
                }
                if (_setting != undefined) {
                    if (_setting.IsPopUpRequired == true) {
                        isPopUpRequired = 'checked="checked"';
                    }
                    if (_setting.IsEmailRequired == true) {
                        isEmailRequired = 'checked="checked"';
                    }
                    _popUpDays = _setting.PopUpDays;
                    _emailDays = _setting.EmailDays;
                    _interval = _setting.Interval;

                }
                var _tr = '<tr>' + '<td>' + _id + '</td>' +
                    '<td>' + type + '</td>' +
                    '<td>' + _name + '</td>' +
                    '<td><div class="icheckbox_flat-blue checkbox-container ' + isPopUpRequired.split('=')[0] + ' "> <input type="checkbox" ' + isPopUpRequired + ' value="IsPopUpRequired" class="flat"  /><ins class="iCheck-helper"></ins></div> </td>' +
                    '<td> <input onblur="this.parentNode.value= this.value" type="number" value="' + _popUpDays + '"  /> </td>' +
                    '<td><div class="icheckbox_flat-blue checkbox-container ' + isEmailRequired.split('=')[0] + ' "> <input type="checkbox" ' + isEmailRequired + ' value="IsEmailRequired"  class="flat"  /><ins class="iCheck-helper"></ins></div> </td>' +
                    '<td> <input onblur="this.parentNode.value= this.value" type="number" value="' + _emailDays + '"  /> </td>' +
                    '<td> <input onblur="this.parentNode.value= this.value" type="number" value="' + _interval + '"  /> </td>' +
                    '</tr>'
                    _tbody.append(_tr);
            }
            if ($.fn.dataTable.isDataTable('#tblSetting')) {
                $('#tblSetting').DataTable().destroy();
            }
            $('#tblSetting').DataTable({
                "order": [[1, "asc"]],
                "columnDefs": [
                               {
                                   "targets": [0],
                                   "visible": false
                               },
                                {
                                    "targets": [1],
                                    "visible": false
                                }
                ]
            });
        }
       
        ///////////////////////////// Report /////////////////////////////////
        $scope.report = {
            'StartDate': new Date(),
            'EndDate': new Date(),
            'CompanyID' : -1
        };
        $scope.selectedEmployees = new Array();
      

        $scope.sendEmail = function () {
            if (checkValidation()) {
                var data = { 'Name': window.location.href.split('#')[1].replace('/', '').replace('Report', ''), 'StartDate': formatDateYYYYmmDD($scope.report.StartDate), 'EndDate': formatDateYYYYmmDD($scope.report.EndDate), 'EmployeeIDs': $scope.selectedEmployees, 'CompanyID': $scope.report.CompanyID };
                $http.post('/Report/SendEmail', data)
                     .then(function (response) {
                         if (response.data == 'True') {
                             addNotification('Success', 'Payslip Email sent to the selected Employees!', 'success');
                         } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                     },
                        function (response) {
                            if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                        });
            }
        };

        $scope.generateReport = function () {
            if (checkValidation()) {
                if (isFormValid('frmReport')) {
                    var _name = window.location.href.split('#')[1].replace('/', '').replace('Report', '');
                    var _startDate = $scope.report.StartDate;
                    var _endDate = $scope.report.EndDate;
                    window.open('/Report/ShowReport?Name=' + _name + '&StartDate=' + _startDate + '&EndDate=' + _endDate + '&CompanyID=' + $scope.report.CompanyID +
                     '&CompanyName=' + $scope.selectedCompanyName + '&EmployeeIDs=' + $scope.selectedEmployees, '_blank');
                }
                //$http.post('/Report/ShowReport')
                //     .then(function (response) {

                //         var link = document.createElement('a');
                //         link.href = url;
                //         document.body.appendChild(link);
                //         link.click();
                //         $('#Report').html(response.data);
                //     },
                //    function (response) {
                //        if (response.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                //    });
            }
        }
        $('body').on('click', '.participant-list ul li > span', function () {
            removeParticipantFromList($(this).attr('employeeid'));
        })
        
        $scope.toggleParticipant = function (employeeID, employeeName) {
            var _anchor = $('.checkbox-container[data-employeeID=' + employeeID + ']').parents('a');
            if (_anchor.find('input[type=checkbox]').is(':checked')) {
                removeParticipantFromList(employeeID);
            }
            else {
                addParticipantToList(employeeID, _anchor)
            }
        }
        $scope.selectCompany = function (value) {
            $('#lbl' + value).removeClass('btn-default').addClass('btn-primary');
            $('#lbl' + value).siblings().removeClass('btn-primary').addClass('btn-default');
            if(value == 'On'){
                $scope.isCustom = false;
            }
            else {
                $scope.isCustom = true;
            }
        }
        function loadEmployees() {
        employeeService.getAllEmployees(1).then(
                function (response) {
                    $scope.employees = response;
                    $scope.bulkEmployees = response;
                    loadCompanies();
                },
            function (data) {
                if (data.status == 403) { addNotification('Warning', 'You dont have enough permission for this operation!', 'warning'); } else { addNotification('Error', 'The application has encountered an unknown error, please contact the IT Department!', 'error'); }
                $('#mdlAppointment').modal("hide");
            });
        }
        function loadCompanies() {
            companyService.getAllCompanies().then(
                function (response) {
                    $scope.companies = response;
                    $scope.selectedCompanyName = 'Select the company';
                    $scope.selectCompany('On');
                },
                function (data) {
                    $scope.message = data.error_description;
                });
        }
        $scope.setCompany = function (ID, Name) {
            $scope.bulkEmployees = new Array();
            for (var i = 0; i < $scope.employees.length; i++) {
                if ($scope.employees[i].CompanyID == ID) {
                    $scope.bulkEmployees.push($scope.employees[i]);
                }
            }
            $scope.report.CompanyID = ID;
            $scope.selectedCompanyName = Name;
            var _list = $scope.selectedEmployees.slice(0);
            for (var i = 0; i < _list.length; i++) {
                removeParticipantFromList(_list[i]);
            }
             
        }
        function addParticipantToList(employeeID, _anchor) {
            if ($scope.selectedEmployees.indexOf(employeeID) == -1) {
                _anchor.find('input[type=checkbox]').prop('checked', true);
                var employeeName = _anchor.text();
                $scope.selectedEmployees.push(employeeID);
                $('.participant-list ul').append('<li  employeeID="' + employeeID + '"><span data-employeeID="' + employeeID + '" employeeID="' + employeeID + '" >X</span>' + employeeName + '</li>');
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
            for (var i = 0; i < $scope.selectedEmployees.length; i++) {
                if ($scope.selectedEmployees[i] == employeeID) {
                    $scope.selectedEmployees.splice(i, 1);
                }
            }
        }
        function checkValidation() {
              if ($scope.isCustom) {
                  if ($scope.selectedEmployees.length == 0) {
                      addNotification('Warning', 'Please select Employees!', 'warning');
                      return false;
                  }
                  else {
                      $scope.report.CompanyID = -1;
                      return true;
                  }
              }
              else {
                  if ($scope.report.CompanyID == -1) {
                      addNotification('Warning', 'Please select Company!', 'warning');
                      return false;
                  }
                  else {
                      var _list = $scope.selectedEmployees.slice(0);
                      for (var i = 0; i < _list.length; i++) {
                          removeParticipantFromList(_list[i]);
                      }
                      $scope.selectedEmployees = new Array();
                      return true;
                  }
                  
              }
          }
    };
})();

