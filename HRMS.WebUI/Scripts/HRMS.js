Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}
function ToJavaScriptDate(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    var _day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    var _month = (dt.getMonth() + 1) < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
    return _day + '/' + _month + "/" + +dt.getFullYear();
}

function ToJavaScriptTime(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return moment(dt).format('HH:mm');
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgEmployee').attr('src', e.target.result);
            $('#txtEmployeePhotoPath').val(e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function TimespanToString(value) {
    var _miliseconds =  value.Milliseconds == 0 ? value.TotalMilliseconds : value.Milliseconds;
    //return moment(new Date(_miliseconds).toUTCString()).format('HH:mm');
    return msToTime(_miliseconds);
}
function msToTime(s) {

    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins);// + ':' + pad(secs) + '.' + pad(ms, 3);
}

function MinutesToTime(minutes) {
    return moment(new Date(99, 5, 5, 0, minutes, 0, 0)).format('HH:mm');
}
function formatDate(date) {
    var monthNames = ["01", "02", "03", "04", "05", "06", "07","08", "09", "10","11", "12"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + '/' + monthNames[monthIndex] + '/' + year;
}
function isFormValid(frm) {
    if (frm.$invalid) {
        angular.forEach(frm.$error.required, function (field) {
            field.$setDirty();
            field.$valid = false;
        });
        return false;
    }
    else {
        return true;
    }
}
function formatDateMMddYYYY(date) {
    var split = date.split('/');
    var day = split[0];
    var month = split[1];
    var year = split[2];
    return month + '/' + day  + '/' + year;
}
function formatDateYYYYmmDD(date) {
    var split = date.split('/');
    var day = split[0];
    var month = split[1];
    var year = split[2];
    return  year + '/' + month + '/' + day;
}

function addNotification(title,text,type) {
    new PNotify({
        title: title,
        text: text,
        type: type,
        styling: 'bootstrap3'
    });
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function calculateSalarySum(basic,transport,housing,telephone,other) {
    var _basic = isNaN(parseFloat(basic)) ? 0 : basic;
    var _transport = isNaN(parseFloat(transport)) ? 0 : transport;
    var _housing = isNaN(parseFloat(housing)) ? 0 : housing;
    var _telephone = isNaN(parseFloat(telephone)) ? 0 : telephone;
    var _other = isNaN(parseFloat(other)) ? 0 : other;
    return _basic + _transport + _housing + _telephone + _other;
}

function isImage(i) {
    return i instanceof HTMLImageElement;
}
// Date picker
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days);
    return date;
}

function getWorkingDays(startDate, endDate) {
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        var isWeekend = (dayOfWeek == 6) || (dayOfWeek == 5);
        if (!isWeekend)
            count++;
        curDate = curDate.addDays(1);
    }
    return count;
}
function isValidDate(str) {
   return !isNaN(Date.parse(str));
}
//$(window).load(function () {
//    $(".date-picker").daterangepicker({ singleDatePicker: !0, singleClasses: "picker_1" }, function (a, b, c) { console.log(a.toISOString(), b.toISOString(), c) });
//    //$("#txtToDate").daterangepicker({ singleDatePicker: !0, singleClasses: "picker_1" }, function (a, b, c) { console.log(a.toISOString(), b.toISOString(), c) });
//    //$("#txtFromDate").daterangepicker({ singleDatePicker: !0, singleClasses: "picker_1" }, function (a, b, c) { console.log(a.toISOString(), b.toISOString(), c) });

//});


function getEmployeeByCompanyID(companyID, employees) {
    var _employees = new Array();
    for (var i = 0; i < employees.length; i++) {
        if (employees[i].CompanyID == companyID) {
            _employees.push(employees[i]);
        }
    }
    return _employees;
}

function loadMonthYears(limit) {
    //$scope.monthYears = new Array();
    //var _currentYear = new Date().getFullYear();
    //var _months = [{ 'MonthID': 1, 'MonthName': "January" }, { 'MonthID': 2, 'MonthName': "February"  },
    //{ 'MonthID': 3, 'MonthName': "March" }, { 'MonthID': 4, 'MonthName': "April"  },
    //{ 'MonthID': 5, 'MonthName': "May"  }, { 'MonthID': 6, 'MonthName': "June"  },
    //{ 'MonthID': 7, 'MonthName': "July"  }, { 'MonthID': 8, 'MonthName': "August"  },
    //{ 'MonthID': 9, 'MonthName': "September"  }, { 'MonthID': 10, 'MonthName': "October"  },
    //{ 'MonthID': 11, 'MonthName': "November"  }, { 'MonthID': 12, 'MonthName': "December"  }, ];
    //var _prevMonth = new Date().getMonth();
    //for (var i = 12; i > 0; i--) {

    //    $scope.monthYears.push(_months[i]);
    //}


    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthYears = new Array();
    var today = new Date();
    var d;
    var month;
    var year = today.getFullYear();
    for (var i = limit; i > 0; i -= 1) {
        d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        month = monthNames[d.getMonth()];
        if ((today.getMonth() - i) < 0) {
            monthYears.push(month + ' - ' + (today.getFullYear() - 1));

        }
        else {
            monthYears.push(month + ' - ' + today.getFullYear());
        }
    }
    for (var i = 0; i < limit; i += 1) {
        d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        month = monthNames[d.getMonth()];
        if ((today.getMonth() + i) > 11) {
            monthYears.push(month + ' - ' + (today.getFullYear() + 1));

        }
        else {
            monthYears.push(month + ' - ' + today.getFullYear());
        }
    }
    return monthYears;
}