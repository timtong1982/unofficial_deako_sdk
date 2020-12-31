import { Discover, IConnectDiscoverData } from '../discover'

describe('Disover class test', () => {
    it('initialization', (done) => {
        Discover.then((data: IConnectDiscoverData) => {
            console.log(data);
            expect(data).not.toBeNull()
            done();
        }, (err) => {
            done(err)
        })
    }, 20000)
})
