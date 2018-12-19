import { resetMocks, mockResponse, mock, mockResponses } from 'jest-fetch-mock';
import Organization, { OrgResponse } from '../';
import Project from '../../Project';
import {
  mockProjectResponse,
  mockListProjectResponse,
  mockOrgResponse,
  mockListResourceResponse,
} from '../../__mocks__/helpers';

const org = new Organization(mockOrgResponse);

describe('Organization class', () => {
  it('should create an Org instance', () => {
    expect(org).toBeInstanceOf(Organization);
    expect(org.name).toEqual(mockOrgResponse.name);
    expect(org.label).toEqual(mockOrgResponse.label);
    expect(org.projectNumber).toEqual(mockOrgResponse.projectNumber);
  });

  describe('get Project', () => {
    afterEach(() => {
      resetMocks();
    });
    it('should return a project', async () => {
      mockResponses(
        [JSON.stringify(mockProjectResponse)],
        [JSON.stringify(mockListResourceResponse)],
      );
      const project: Project = await org.getProject('project');
      expect(mock.calls.length).toBe(2);
      expect(project).toBeInstanceOf(Project);
      expect(project.id).toEqual(mockProjectResponse['@id']);
      expect(project.resourceNumber).toEqual(1);
    });
  });
  describe('list Projects', () => {
    afterEach(() => {
      resetMocks();
    });
    it('should return a list of projects', async () => {
      mockResponses(
        [JSON.stringify(mockListProjectResponse)],
        [JSON.stringify(mockProjectResponse)],
        [JSON.stringify(mockProjectResponse)],
        [JSON.stringify(mockListProjectResponse)],
        [JSON.stringify(mockListProjectResponse)],
      );
      const projects: Project[] = await org.listProjects();
      expect(mock.calls.length).toBe(5); // TODO: VERY BAD, wait after API refactor before addressing to backend team
      expect(projects.length).toEqual(2);
    });
  });
});