myApp.controller('mapCtrl', function($location, constants, $routeParams, dataService) {
    var vm = this;
    vm.deviceKey = null;

    vm.sources = constants.sources;
    vm.icons = constants.infoWindows.icons;
    vm.data = constants.infoWindows.data;
    
    vm.go = function(path) {
        console.log('going to ' + path);
        $location.path(path)
    }
    
    vm.markersData = [
        {
            key: 'pressure',
            lat: 800.0000001, 
            lng: 200.0000001,
            draggable: true,
            group: 'HVAC',
            icon: {
                url: '',
                unit: 'Pa'
            }
        },
        {
            key: 'temperature',
            lat: 850.0000001, 
            lng: 250.0000001,
            draggable: true,
            group: 'HVAC',
            icon: {
                url: '',
                unit: '&deg;C'
            }
        },
        {
            key: 'humidity',
            lat: 850.0000001, 
            lng: 60.0000001,
            draggable: true,
            group: 'HVAC',
            icon: {
                url: '',
                unit: '%'
            }
        },
        {
            key: 'proximity',
            lat: 850.0000001, 
            lng: 550.0000001,
            draggable: true,
            group: 'HVAC',
            icon: {
                url: '',
                unit: 'mm'
            }
        },
        {
            key: 'accelerometer',
            lat: 450.0000001, 
            lng: 50.0000001,
            draggable: true,
            group: 'HVAC',
            icon: {
                url: '',
                unit: ''
            }
        },
        {
            key: 'magnetic',
            lat: 450.0000001, 
            lng: 200.0000001,
            draggable: true,
            group: 'HVAC',
            icon: {
                url: '',
                unit: ''
            }
        },
        {
            key: 'gyroscope',
            lat: 450.0000001, 
            lng: 450.0000001,
            draggable: true,
            group: 'HVAC',
            icon: {
                url: '',
                unit: ''
            }
        },
        {
            key: 'luminosity',
            lat: 150.0000001, 
            lng: 450.0000001,
            draggable: true,
            group: 'HVAC',
            icon: {
                url: '',
                unit: 'Lux'
            }
        }
    ];
    
    vm.init = function() {
         if($routeParams && $routeParams.deviceId) {
             vm.deviceKey = $routeParams.deviceId;
             vm.params = {"id":  vm.deviceKey }
             vm.tag = "dashboard_" +  vm.deviceKey;
         }
        
        //for(var i = 0; i < vm.markersData.length; i++){
            
        //}
        
        /*var obj = {
            pressure: marker.details.pressure.value || 'N/A',
            temperature: marker.details.temperature.value || 'N/A',
            humidity: marker.details.humidity.value || 'N/A',
            proximity: marker.details.proximity.value || 'N/A',
            accelerometer: (marker.details.acc_x)? marker.details.acc_x.value + ', ' + marker.details.acc_y.value + ', ' + marker.details.acc_z.value: 'N/A',
            magnetic: (marker.details.mag_x)? marker.details.mag_x.value + ', ' + marker.details.mag_y.value + ', ' + marker.details.mag_z.value: 'N/A',
            gyroscope: (marker.details.gyr_x)? marker.details.gyr_x.value + ', ' + marker.details.gyr_y.value + ', ' + marker.details.gyr_z.value: 'N/A',
            luminosity: marker.details.luminosity.value || 'N/A'
        }
        */
    }
    
    vm.transformData = function(data){
        
        var dataKeys = Object.keys(data);
        for(var i = 0; i < dataKeys.length; i++){
            var val = data[dataKeys[i]].value;
            if(val){
                if(isNaN(val)){
                    data[dataKeys[i]] = val;
                }else{
                    data[dataKeys[i]] = parseFloat(val);
                }
            }            
        }
        return data;
    }
    
    vm.onSelectAsset = function(data) {
        if(data){
            vm.selectedDevice = data;
            vm.params = {"id": data.assetId}
        }
        if($routeParams && $routeParams.deviceId != data.assetId )
        	$location.path("/map/deviceId/"+data.assetId)
    }
    
    vm.setMarkerIcon = function(data, marker){
        marker.icon =  constants.sources[marker.source]["mapMarker"];
        return marker;
    }
    
    vm.parseImageMapData = function(data, icons) {
        
        //extracting the img src from icons objects
        var regex = /<img.*?src=['"](.*?)['"]/;
        
        for(var i = 0; i < vm.markersData.length; i++){
            if(icons[vm.markersData[i].key]){
                vm.markersData[i].icon.url = regex.exec(icons[vm.markersData[i].key].$$unwrapTrustedValue())[1];
            }
        }
        
        
    }
    
    vm.callback = function(data){
        return data;
    }
});
    
myApp.controller('menuCtrl', function(headerItemsJson, menuItemsJson) {
    var vm = this;
    vm.headerItems = headerItemsJson;
    vm.user = JSON.parse($.cookie('user'));
    vm.menuItems = menuItemsJson;
     
});

myApp.controller('searchDevicesCtrl', function($location, headerItemsJson, menuItemsJson, $route, $routeParams) {
    var vm = this;
    
   vm.init = function() {
         if($routeParams && $routeParams.deviceId) {
             vm.selectedDevice = $routeParams.deviceId;
             vm.params = {"id":  vm.deviceKey }
             vm.tag = "dashboard_" +  vm.deviceKey;
         }
        
    }
    vm.listCallback = function(data){
        vm.tripsData = [
            {
                "key" : "all",
                "name" : "All"
            }
        ];
        for(var i = 0; i < data.length; i++) {
            vm.tripsData.push({"key": data[i].id, "name": data[i].id})
        }
        return vm.tripsData;
    }
     
     
     vm.onSelect = function(data){
         if(data){
            vm.selectedDevice = data.originalObject;
            vm.params = {"id": vm.selectedDevice.key}
        }
         
        if(vm.selectedDevice.key == "all") {
            $location.path("/map");
        } else {
            if($routeParams.deviceId)
                $route.updateParams({"deviceId": vm.selectedDevice.key});
        	else 
            	$location.path($route.current.originalPath + "/deviceId/" + vm.selectedDevice.key);
        }
         
        return data;
        
     }
     
});

myApp.controller('notificationCtrl', function(httpClient) {
    var vm = this;
    vm.params = {} 
    httpClient
        .get("app/api/notifications/getSettings", null)
        .then(
        function(data, response) {
            if(data && (data.emails || data.mobiles)){
                vm.emails= [];//data.emails;
                vm.mobiles = []; //data.mobiles;
                for(var i = 0; i < data.emails.length; i++){
                    vm.emails.push({"text":data.emails[i]});
                }
                for(var i = 0; i < data.mobiles.length; i++){
                    vm.mobiles.push({"text":data.mobiles[i]});
                }
            }else{
                vm.emails = [];
                vm.mobiles = [];
            }
        },
        function(err) {
            console.log('ERROR', err);
        });

    vm.buildParams = function(){
        var emailsArray = [];
        var mobilesArray = [];
        for(var i = 0; i < vm.emails.length; i++){
            emailsArray.push(vm.emails[i]["text"]);
        }
        for(var i = 0; i < vm.mobiles.length; i++){
            mobilesArray.push(vm.mobiles[i]["text"]);
        }
        vm.params["emails"] = emailsArray;
        vm.params["mobiles"] = mobilesArray;
    } 

});

myApp.controller('rulesCtrl', function(httpClient, $sce, $timeout,$routeParams) {
    var vm = this;
    var params = {};
    params["scriptName"] = $routeParams.id;
    httpClient
        .get("app/api/rules/getGenericRuleEditor", null)
        .then(
        function(data, response) {
             vm.rulesrc = $sce.trustAsResourceUrl(data);
             $timeout(function() {
               $(".loading-frame").css("display", "none")
               $(".allFrame").css("display","")
            }, 2000);
        },
        function(err) {
            console.log('ERROR');
        });
});

myApp.controller('alertsCtrl', function(httpClient, $routeParams, constants) {
       var vm = this;
       vm.icons = constants.infoWindows.icons;
       vm.deviceKey = null;
     
       vm.init = function(){
            if($routeParams && $routeParams.deviceId) {
                vm.deviceKey = $routeParams.deviceId;
                vm.params = {"id":  vm.deviceKey }
                vm.tag = "dashboard_" +  vm.deviceKey;
                httpClient.get("app/api/getLatestDevice", vm.params).then(
                function(data, response) {
                    vm.summaryData(data)
                },
                function(err) {
                    console.log('ERROR', error);
                });
             }
        }
		
        vm.formatData = function(data){
            if(data){
                return {documents: data, count: data.length}  
            }
        }
        
        vm.summaryData = function(data) {
            if(data && data[vm.deviceKey] && data[vm.deviceKey][0] && data[vm.deviceKey][0][0])
                vm.selectedDevice = data[vm.deviceKey][0][0];
                var selectedDeviceSensors = _.keys(vm.selectedDevice);
            	vm.colDef = _.filter(constants.alertsGrid, function(columns) { 
                    return selectedDeviceSensors.indexOf(columns.field) > -1;
                });
            
        }
});
        	

myApp.controller('dashboardCtrl', function($scope,  wsClient, httpClient, $routeParams, constants) {
    var vm = this;
    vm.icons = constants.infoWindows.icons;
    vm.deviceKey = null;
    vm.gridsterOptions = {
        pushing: true,
		floating: true,
        minRows: 1, // the minimum height of the grid, in rows
        maxRows: 100,
        columns: 4, // the width of the grid, in columns
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        mobileBreakPoint: 1024, // if the screen is not wider that this, remove the grid layout and stack the items
        minColumns: 1,
        resizable: {
            enabled: true
        },
        draggable: {
            enabled: true
        }
    };
    
    vm.init = function(){
        if($routeParams && $routeParams.deviceId) {
            vm.deviceKey = $routeParams.deviceId;
            vm.params = {"id":  vm.deviceKey }
            vm.tag = "dashboard_" +  vm.deviceKey;
            wsClient.subscribe(vm.tag, vm.consumeData.bind(vm), $scope.$id);  
            httpClient.get("app/api/getLatestDevice", vm.params).then(
                function(data, response) {
                    vm.consumeData(data)
                },
                function(err) {
                    console.log('ERROR', error);
                });
            
            httpClient.get("app/api/getDeviceHistory", vm.params).then(
                function(data, response) {
                    vm.consumeHistoricalData(data)
                },
                function(err) {
                    console.log('ERROR', error);
                });
        }
        vm.dygraphsTempHumiParams = {
            "query": [
                {
                    "sensor": ['temperature','humidity'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'dygraphs'
        };
        vm.dygraphsCo2Params = {
            "query": [
                {
                    "sensor": ['co2'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'dygraphs'
        };
        vm.dygraphsPresParams = {
            "query": [
                {
                    "sensor": ['pressure'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'dygraphs'
        };
        vm.dygraphsProxParams = {
            "query": [
                {
                    "sensor": ['proximity'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'dygraphs'
        };
        vm.dygraphsTvocParams = {
            "query": [
                {
                    "sensor": ['tvoc'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'dygraphs'
        };
        vm.dygraphsAccParams = {
            "query": [
                {
                    "sensor": ['acc_x','acc_y','acc_z'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'dygraphs'
        };
        vm.accelerometerParams = {
            "query": [
                {
                    "sensor": ['acc_x','acc_y','acc_z'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'accelerometer'
        };
        vm.dygraphsParticleParams = {
            "query": [
                {
                    "sensor": ['particle'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'dygraphs'
        };
        vm.dygraphsGyrParams = {
            "query": [
                {
                    "sensor": ['gyr_x','gyr_y','gyr_z'],
                    "device": vm.deviceKey 
                }
            ],
            "format": 'dygraphs'
        };
    }


    vm.consumeHistoricalData = function(data) {
        vm.historicalData = data;
    }
    
    vm.consumeData = function(data) {
        console.log('consuming data: ', data);
        if(data.latest) {
            data = data.latest
            vm.latest =  data;
        }
        if(data && data[vm.deviceKey] && data[vm.deviceKey][0] && data[vm.deviceKey][0][0]) {
            vm.selectedDevice = data[vm.deviceKey][0][0];
            vm.latest = vm.selectedDevice
            if(vm.latest.acc_x){
                vm.latest.acceleration = {
                    x: vm.latest.acc_x,
                    y: vm.latest.acc_y,
                    z: vm.latest.acc_z
                }
            }
		 }
    }
    
    vm.checkDygraphsTempHumData = function(data){
        if(data instanceof Array){
            return data;
        }else{
            return [[
                moment().valueOf(),
                data.latest.temperature,
                data.latest.humidity
            ]];
        } 
    }
    
    vm.checkDygraphsCo2Data = function(data){
        if(data instanceof Array){
            return data;
        }else{
            return [[
                moment().valueOf(),
                data.latest.co2
            ]];
        } 
    }
    
    vm.checkDygraphsPressData = function(data){
        if(data instanceof Array){
            return data;
        }else{
            return  [[
                moment().valueOf(),
                data.latest.pressure
            ]];
        }
    }
    
    vm.checkDygraphsProxData = function(data){
        if(data instanceof Array){
            return data;
        }else{
            return  [[
                moment().valueOf(),
                data.latest.proximity
            ]];
        }
    }
    
    vm.checkDygraphsTvocData = function(data){
        if(data instanceof Array){
            return data;
        }else{
            return  [[
                moment().valueOf(),
                data.latest.tvoc
            ]];
        }
    }
    
    vm.checkDygraphsAccData = function(data){
        if(data instanceof Array){
            return data;
        }else{
            return  [[
                moment().valueOf(),
                data.latest.acc_x,
                data.latest.acc_y,
                data.latest.acc_z
            ]];
        }
    }
    
    vm.checkDygraphsParticleData = function(data){
        if(data instanceof Array){
            return data;
        }else{
            return  [[
                moment().valueOf(),
                data.latest.particle
            ]];
        }
    }
    
    vm.checkDygraphsGyrData = function(data){
        if(data instanceof Array){
            return data;
        }else{
            return  [[
                moment().valueOf(),
                data.latest.gyr_x,
                data.latest.gyr_y,
                data.latest.gyr_z
            ]];
        }
    }
    
    vm.grideyeFormatData = function(data){
        return JSON.format(data.latest.temperature_list);
    }

    vm.historicalFormatData = function(data){
        if(data.historical) 
            return data.historical;
        else
            return data;
    }  

    vm.temperatureFormatData = function(data) {
        return data.latest.temperature;
    }
    
    vm.pressureFormatData = function(data){
        return data.latest.pressure;
    }

    vm.humidityFormatData = function(data){
        return data.latest.humidity;
    }
    
    vm.proximityFormatData = function(data){
        return data.latest.proximity;
    }
    
    vm.tvocFormatData = function(data){
        return data.latest.tvoc;
    }
    
    vm.co2FormatData = function(data){
        return data.latest.co2;
    }
    
    vm.accelerometerFormatData= function(data){
        if(data instanceof Array){
            var latest = data[data.length - 1];
            return {"x": latest.acc_x, "y": latest.acc_y, "z": latest.acc_z};
        }else{
            return {"x": data.latest.acc_x, "y": data.latest.acc_y, "z": data.latest.acc_z};
        }
    }
    
    vm.callback = function(data){
        return data;
    }
    
});






