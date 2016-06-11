angular.module('crypto.controllers', [])

.controller('HomeCtrl', function($scope, $injector, $q, balances, wallets, currencyDatardd) {

    $scope.wallets = [];
    
    balances.getBalances(wallets).then(function(data){
        for(i in wallets){
            $scope.wallets.push({
                label: wallets[i].type,
                address: wallets[i].address,
                status: typeof data[i] == 'object'? 'error':'resolved',
                response: data[i]
            });
        }
    });

    currencyDatardd.full().then(function(data){
        $scope.price = data.price.usd;
        if (typeof data.price.usd == 'object') $scope.priceStatus = 'error';
        else $scope.priceStatus = 'resolved';
    }, function(error){
        console.log('error');
        $scope.price = error;
    });
})

.controller('ResponseCtrl', function($scope, $stateParams, balances, wallets, currencyDatardd) {
    $scope.walletData = {};    
    
    if ($stateParams.address == 'price'){
        currencyDatardd.full().then(function(data){
            $scope.walletData.label = 'RDD price at coinmarketcap'
            $scope.walletData.response = data.price.usd;
            $scope.price = data;
            if (typeof data.price.usd == 'object') $scope.walletData.status = 'error';
            else $scope.walletData.status = 'resolved';
        });
    }
    else {
        balances.getBalances(wallets).then(function(data){
        for(i in wallets){
            if (wallets[i].address == $stateParams.address) {
                $scope.walletData.label = wallets[i].type;
                $scope.walletData.address = wallets[i].address;
                if ( typeof data[i] == 'object' ) $scope.walletData.status = 'error';
                else $scope.walletData.status = 'resolved';
                $scope.walletData.response = data[i];
            }
        }
        });
    }
})
;