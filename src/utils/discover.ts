import * as mdns from 'mdns';
import { Constants } from '../constants';
import { IDisoverResult } from '../model/discoverModel';

const sequence = [
    mdns.rst.DNSServiceResolve(),
    'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({ families: [4] }),
    mdns.rst.makeAddressesUnique()
];

interface IConnectDiscoverData {
    address: string;
    port: number;
}

type RawResolveType = (data: mdns.Service) => void;

const browser = mdns.createBrowser(mdns.tcp(Constants.serviceType), { resolverSequence: sequence })
const queue: RawResolveType[] = [];

function startDiscover() {
    browser.start();
    return new Promise<mdns.Service>((resolve) => queue.push(resolve));
}

browser.on('serviceUp', (info: mdns.Service) => {
    if (info && info.name === Constants.serviceName) {
        const resolve = queue.shift();
        if (resolve) {
            resolve(info);
        }
    }
});

function Discover() {
    var promises: Promise<IDisoverResult>[] = [];
    let timeoutId: NodeJS.Timeout | null = null;
    promises.push(startDiscover().then(data => ({
        address: (data.addresses && data.addresses.length) ? data.addresses[0] : '',
        version: data.txtRecord?.version,
        api: data.txtRecord?.api,
        sn: data.txtRecord?.sn,
        name: data.name,
        protocol: data.type.protocol,
        port: data.port
    } as IDisoverResult)));
    promises.push(new Promise((_resolve, reject) => {
        timeoutId = setTimeout(() => {
            reject('Discover timeout');
        }, Constants.discoverTimeout)
    }));

    return Promise.race(promises).finally(() => {
        if (browser) {
            browser.stop();
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });
}

export {
    Discover,
    IConnectDiscoverData
}
