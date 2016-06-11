angular.module('crypto.services', [])

.factory('$localStorage', ['$window', function($window) {
    return {
        store: function(key, value) {
          $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        storeObject: function(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key,defaultValue) {
          return JSON.parse($window.localStorage[key] || defaultValue);
        },
        remove: function(key) {
          $window.localStorage.removeItem(key);
        },
        check: function(key) {
            if ( $window.localStorage[key] ) return true;
            else return false;
        }
    }
}])

.factory('balances', function($localStorage, $injector, $q) {
    var returnFunctions = {};
    
    balancesApi = function(wallets) {
        var promises = [];
        var apiErrors = [];
        var deferred = $q.defer();
        promises = wallets.map(function (wallet){
            var walletData = $injector.get('walletData'+wallet.type);
            var balance = walletData.balance(wallet.address)
              .then(function(response){
                  if (response == 'error' || response == undefined || response == 'NaN'){
                      apiErrors.push(wallet.type);
                      response = '0';
                  }
                  //handling int balances for correct formatting
                  if ( (parseFloat(response) % 1)==0 ) response = response + '.00';
                  return parseFloat(response)
                }
              );
            return balance;
        });
        $q.all(promises).then(function(results){
            $localStorage.storeObject('balances', results);
            deferred.resolve(results);
        });
        
        return deferred.promise;
    };
    
    balancesLocal = function() {
        return $localStorage.getObject('balances', '[]');
    };
    
    returnFunctions.getBalances = function (wallets) {
        if ( !$localStorage.check('balances') ){
            return balancesApi(wallets);
        }
        else{
            return $q.when(balancesLocal()).then(function(result){
                return result;
            })
        }
    };
    
    return returnFunctions;
}) 

.factory('wallets', function() {
    return [
        {type: 'btc', address: '1KwA4fS4uVuCNjCtMivE7m5ATbv93UZg8V'},
        {type: 'doge', address: 'D6S2VGVMXEmgpo7aGBro5QVYQgzX1bRkq6'},
        {type: 'ltc', address: 'LfcPeb2J69ibW17Lk2sA7zBkkqoyTKHF5H'},
        {type: 'eth', address: '0xb794f5ea0ba39494ce839613fffba74279579268'},
        {type: 'xrp', address: 'r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV'},
        {type: 'xcp', address: '1Co1dcFX6u1wQ8cW8mnj1DEgW7xQMEaChD'},
        {type: 'rdd', address: 'RoJojniqHEK5hU9RszANxR3D7KRXe9HNxx'},
        {type: 'dash', address: 'Xn623YuSrmgB2xBFa6rD1swwAtcpURHbgq'},
        {type: 'ppc', address: 'PThCTMeytywhk9p2Y1HGUDeaSSKNBkbPcD'},
    ];
})
;