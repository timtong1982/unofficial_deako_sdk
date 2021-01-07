import { IDisoverResult } from '../../model/discoverModel'
import { Discover, IConnectDiscoverData } from '../discover'

describe('Disover class test', () => {
    it('initialization', (done) => {
        Discover().then((data: IDisoverResult) => {
            expect(data).not.toBeNull();
            expect(data.address).not.toBeNull();
            done();
        }, (err) => {
            done(err)
        })
    }, 20000)
})
