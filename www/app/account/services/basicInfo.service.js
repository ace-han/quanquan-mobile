
define([
    'angular'
    , '../module'
    , '../namespace'

],
function (angular, module, namespace) {
    'use strict';
    // in charge of genders, cities, high_schools, colleges choices

    var name = namespace + ".basicInfoService";
    
    
    module.factory(name, basicInfoService);

    basicInfoService.$inject = ['Restangular'];

    return basicInfoService;

    function basicInfoService(Restangular){
        var service = {
            getGenderList: getGenderList
            , getGenderChoices: getGenderChoices
            , getCityList: getCityList
            , getCityChoices: getCityChoices
            , getHighSchoolList: getHighSchoolList
            , getHighSchoolChoices: getHighSchoolChoices
            , getCollegeList: getCollegeList
            , getCollegeChoices: getCollegeChoices
            , getSchoolList:  getSchoolList
            , getSchoolChoices: getSchoolChoices
            , resolveGender: resolveGender
            , resolveGenderIconClass: resolveGenderIconClass
        }

        var accountRestangular = Restangular.all('account')
            , citiesRestangular = accountRestangular.all('cities')
            , schoolRestangular = accountRestangular.all('schools')
            , genderRestangular = accountRestangular.all('genders')

        var schoolTypes = {
            HIGH_SCHOOL: 'high_school'
            , COLLEGE: 'college'
        }
        return service;

        function getGenderList() {
            return genderRestangular.getList()
                .then(function(data){
                    // we just need the unrestangularized data;
                    // only apply for male or female;
                    return data.plain().filter(function(e){
                        return e.value != null;
                    });
                });
        }

        function getGenderChoices(){
            return getGenderList();
        }

        function getCityList() {
            return citiesRestangular.getList()
                .then(function(data){
                    // we just need the unrestangularized data;
                    return data.plain();
                });
        }

        function getCityChoices() {
            return getCityList();
        }

        function getHighSchoolList() {
            return getSchoolList({type: schoolTypes.HIGH_SCHOOL});
        }

        function getHighSchoolChoices(){
            return getSchoolChoices({type: schoolTypes.HIGH_SCHOOL});
        }

        function getCollegeList() {
            return getSchoolList({type: schoolTypes.COLLEGE});
        }

        function getCollegeChoices(){
            return getSchoolChoices({type: schoolTypes.COLLEGE});
        }

        function getSchoolList(params){
            params = params || {}
            return schoolRestangular.getList(params)
                .then(function(data){
                    // we just need the unrestangularized data;
                    return data.plain();
                });
        }

        function getSchoolChoices(params){
            return getSchoolList(params)
                    .then(function(data){
                        var result = []
                        for(var i in data){
                            result.push({
                                label: data[i].name
                                , value: data[i].id
                            })
                        }
                        return result;
                    })
        }

        function resolveGender(nGender){
            if(nGender === 0){
                return 'female';
            } else if (nGender === 1){
                return 'male';
            } else {
                return 'unknown';
            }
        }

        function resolveGenderIconClass(nGender){
            if(nGender === 0){
                return 'ion-female';
            } else if (nGender === 1){
                return 'ion-male';
            } else {
                //return 'fa-genderless';
                return 'hide';
            }
        }

    }
});