const mdns = require('mdns')

// mdns.on('query', function (query) {
//     console.log('got a query packet:', query)
// });
// mdns.on('response', function (response) {
//     console.log('got a response packet:', response)
// });

// const browser = mdns.createBrowser(mdns.tcp('_telnet'));
// browser.on('serviceUp', (service) => {
//     console.log('service up: ', service);
// });
// browser.on('serviceDown', (service) => {
//     console.log('service down: ', service);
// });
// browser.start();
var sequence = [
    mdns.rst.DNSServiceResolve(),
    'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({ families: [4] }),
    mdns.rst.makeAddressesUnique()
];
var browser = mdns.createBrowser(mdns.tcp('_telnet'), { resolverSequence: sequence });
browser.on('serviceUp', function (service) {
    console.log("service up: ", service);
});
browser.on('serviceDown', function (service) {
    console.log("service down: ", service);
});

browser.start();
