(function () {
    'use strict';

    angular
        .module('HRMS')
        .factory('salaryService', salaryService);

    salaryService.$inject = ['$resource', '$q', '$http'];

    function salaryService($resource, $q, $http) {
        var resource = $resource('/Salary/:action/:param', { action: '@action', param: '@param' }, {
            'update': { method: 'PUT' }
        });

        // Salary

        var _getSalary = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllSalaries", param: "" },
				function (result) {
				    if (result == null) {
				        result = [];
				    };
				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;

        };

        var _getSalaryById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'SalaryById', param: contactId },
				function (result) {
				    if (result == null) {
				        result = [];
				    };

				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;
        };

        var _addSalary = function (salaryType) {
            var deferred = $q.defer();

            $http.post('/Salary/CreateSalary', salaryType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateSalary = function (salaryType) {
            var deferred = $q.defer();

            $http.post('/Salary/UpdateSalary/' + salaryType.id, salaryType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteSalary = function (Id) {
            var deferred = $q.defer();

            $http.post('/Salary/DeleteSalary/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        var _getOtherText = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllOtherTexts", param: "" },
				function (result) {
				    if (result == null) {
				        result = [];
				    };
				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;
        };

        // Increment

        var _getIncrement = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllIncrements", param: "" },
				function (result) {
				    if (result == null) {
				        result = [];
				    };
				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;

        };

        var _getIncrementById = function (incrementId) {
            var deferred = $q.defer();
            resource.query({ action: 'IncrementById', param: incrementId },
				function (result) {
				    if (result == null) {
				        result = [];
				    };

				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;
        };

        var _addIncrement = function (increment) {
            var deferred = $q.defer();

            $http.post('/Salary/CreateIncrement', increment)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateIncrement = function (increment) {
            var deferred = $q.defer();

            $http.post('/Salary/UpdateIncrement/' + increment.id, increment)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteIncrement = function (Id) {
            var deferred = $q.defer();

            $http.post('/Salary/DeleteIncrement/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        // Deduction

        var _getDeduction = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllDeductions", param: "" },
				function (result) {
				    if (result == null) {
				        result = [];
				    };
				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;

        };

        var _getDeductionById = function (deductionId) {
            var deferred = $q.defer();
            resource.query({ action: 'DeductionById', param: deductionId },
				function (result) {
				    if (result == null) {
				        result = [];
				    };

				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;
        };

        var _addDeduction = function (deduction) {
            var deferred = $q.defer();
             $http.post('/Salary/CreateDeduction', deduction)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateDeduction = function (deduction) {
            var deferred = $q.defer();

            $http.post('/Salary/UpdateDeduction/' + deduction.id, deduction)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteDeduction = function (Id) {
            var deferred = $q.defer();

            $http.post('/Salary/DeleteDeduction/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        // Deduction Type

        var _getDeductionType = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllDeductionTypes", param: "" },
				function (result) {
				    if (result == null) {
				        result = [];
				    };
				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;

        };

        var _getDeductionTypeById = function (deductionTypeId) {
            var deferred = $q.defer();
            resource.query({ action: 'DeductionTypeById', param: deductionTypeId },
				function (result) {
				    if (result == null) {
				        result = [];
				    };

				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;
        };

        var _addDeductionType = function (deductionType) {
            var deferred = $q.defer();

            $http.post('/Salary/CreateDeductionType', deductionType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updateDeductionType = function (deductionType) {
            var deferred = $q.defer();

            $http.post('/Salary/UpdateDeductionType/' + deductionType.id, deductionType)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deleteDeductionType = function (Id) {
            var deferred = $q.defer();

            $http.post('/Salary/DeleteDeductionType/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };

        // Public Holiday

        var _getPublicHoliday = function () {
            var deferred = $q.defer();
            resource.query({ action: "AllPublicHoliday", param: "" },
				function (result) {
				    if (result == null) {
				        result = [];
				    };
				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;

        };

        var _getPublicHolidayById = function (contactId) {
            var deferred = $q.defer();
            resource.query({ action: 'PublicHolidayById', param: contactId },
				function (result) {
				    if (result == null) {
				        result = [];
				    };

				    deferred.resolve(result);
				},
				function (response) {
				    deferred.reject(response);
				});
            return deferred.promise;
        };

        var _addPublicHoliday = function (publicHoliday) {
            var deferred = $q.defer();

            $http.post('/Salary/CreatePublicHoliday', publicHoliday)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _updatePublicHoliday = function (publicHoliday) {
            var deferred = $q.defer();

            $http.post('/Salary/UpdatePublicHoliday/' + publicHoliday.id, publicHoliday)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        var _deletePublicHoliday = function (Id) {
            var deferred = $q.defer();

            $http.post('/Salary/DeletePublicHoliday/' + Id)
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                         function (response) {
                             deferred.reject(response);
                         });
            return deferred.promise;
        };


        // Payslip 

        var _generatePayslipByMonth = function (month) {
            var deferred = $q.defer();
            $http.post('/Salary/GeneratePayslip/',month )
                 .then(function (result) {
                     deferred.resolve(result);
                 },
                function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        };

        var _addPayslip = function (payslip) {
            var deferred = $q.defer();
            $http.post('/Salary/CreatePayslip', payslip)
                .then(function (result) {
                    deferred.resolve(result);
                },
                        function (response) {
                            deferred.reject(response);
                        });

            return deferred.promise;
        };

        return {

            // Salary

            getAllSalary: _getSalary,
            getSalaryById: _getSalaryById,
            createSalary: _addSalary,
            updateSalary: _updateSalary,
            deleteSalary: _deleteSalary,
            getOtherTexts: _getOtherText,

            // Increment 

            getAllIncrement: _getIncrement,
            getIncrementById: _getIncrementById,
            createIncrement: _addIncrement,
            updateIncrement: _updateIncrement,
            deleteIncrement: _deleteIncrement,

            // Deduction

            getAllDeduction: _getDeduction,
            getDeductionById: _getDeductionById,
            createDeduction: _addDeduction,
            updateDeduction: _updateDeduction,
            deleteDeduction: _deleteDeduction,

            // Deduction Type

            getAllDeductionType: _getDeductionType,
            getDeductionTypeById: _getDeductionTypeById,
            createDeductionType: _addDeductionType,
            updateDeductionType: _updateDeductionType,
            deleteDeductionType: _deleteDeductionType,

            // Public Holiday

            getAllPublicHoliday: _getPublicHoliday,
            getPublicHolidayById: _getPublicHolidayById,
            createPublicHoliday: _addPublicHoliday,
            updatePublicHoliday: _updatePublicHoliday,
            deletePublicHoliday: _deletePublicHoliday,

            // Payslip

            generatePayslipByMonth: _generatePayslipByMonth,
            createPayslip: _addPayslip,


        };

    }

})();