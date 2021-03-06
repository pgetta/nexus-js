import Storage from '..';
import { mockFetchers } from '../../testUtils';
import { S3StoragePayload } from '../types';

const storage = Storage(mockFetchers, { uri: 'http://api.url/v1' });

describe('Storage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('get', () => {
    it('should make httpGet call to the storages api with the right url', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await storage.get('org', 'project', 'myId');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project/myId',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should make httpGet call to the storages api with the right url and query params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await storage.get('org', 'project', 'myId', { rev: 1 });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project/myId?rev=1',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });
  });

  describe('list', () => {
    it('should make httpGet call to the storages api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await storage.list('org', 'project');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should make httpGet with query params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await storage.list('org', 'project', {
        createdBy: 'me',
        type: 'S3Storage',
      });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project?createdBy=me&type=S3Storage',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });
  });

  describe('create', () => {
    it('should make httpPost call to the storages api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload: S3StoragePayload = {
        '@id': 'nxv:mys3storage',
        '@type': ['S3Storage'],
        default: false,
        bucket: 'mybucket',
        endpoint: 'https://s3.us-west-1.amazonaws.com',
        accessKey: 'AKIAIOSFODNN7EXAMPLE',
        secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      };
      await storage.create('org', 'project', payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    });
  });

  describe('update', () => {
    it('should make httpPut call to the storages api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload: S3StoragePayload = {
        '@id': 'nxv:mys3storage',
        '@type': ['S3Storage'],
        default: false,
        bucket: 'mybucket',
        endpoint: 'https://s3.us-west-1.amazonaws.com',
        accessKey: 'AKIAIOSFODNN7EXAMPLE',
        secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      };
      await storage.update('org', 'project', 'myStorageId', 1, payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project/myStorageId?rev=1',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('PUT');
    });
  });

  describe('tag', () => {
    it('should make httpPost call to the storages api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        rev: 1,
        tag: 'whatever',
      };
      await storage.tag('org', 'project', 'myViewId', 1, payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project/myViewId?rev=1',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    });
  });

  describe('deprecate', () => {
    it('should make httpDELETE call to the storages api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await storage.deprecate('org', 'project', 'myStorageId', 1);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project/myStorageId?rev=1',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('DELETE');
    });
  });

  describe('poll', () => {
    xit('should make httpGet call to the storages api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await storage.poll('org', 'project', 'myViewId', { pollTime: 50 });
      console.log(fetchMock.mock.calls[0]);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/storages/org/project/myViewId',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });
  });
});
