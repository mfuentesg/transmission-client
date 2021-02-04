import { to } from '../http';

describe('libs/http', () => {
  it('should return err on failed promises', async () => {
    const [err, data] = await to(Promise.reject(new Error('an error')));

    expect(err).not.toBeNull();
    expect(err.message).toEqual('an error');
    expect(data).toBeUndefined();
  });

  it('should return data on success', async () => {
    const [err, data] = await to(Promise.resolve('success'));
    expect(err).toBeNull();
    expect(data).toEqual('success');
  });
});
