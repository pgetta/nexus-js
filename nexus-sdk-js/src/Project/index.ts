import Resource from '../Resource';
import { PaginationSettings, PaginatedList } from '../utils/types';
import View from '../View';
import ElasticSearchView from '../View/ElasticSearchView';
import SparqlView from '../View/SparqlView';
import {
  getProject,
  listProjects,
  createProject,
  deprecateProject,
  updateProject,
  subscribe,
} from './utils';
import {
  ApiMapping,
  Context,
  CreateProjectPayload,
  ProjectResponse,
} from './types';
import { WILDCARD_SCHEMA_ID } from '../Schema';
import NexusFile from '../File';

export default class Project {
  context?: Context;
  id: string;
  type: string;
  base: string;
  vocab: string;
  apiMappings: ApiMapping[];
  label: string;
  orgLabel: string;
  orgUuid: string;
  uuid: string;
  rev: number;
  deprecated: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  description?: string;

  static get = getProject;
  static list = listProjects;
  static create = createProject;
  static update = updateProject;
  static deprecate = deprecateProject;
  static subscribe = subscribe;

  constructor(projectResponse: ProjectResponse) {
    this.context = projectResponse['@context'];
    this.id = projectResponse['@id'];
    this.type = projectResponse['@type'];
    this.base = projectResponse.base;
    this.vocab = projectResponse.vocab;
    this.apiMappings = projectResponse.apiMappings;
    this.label = projectResponse._label;
    this.orgLabel = projectResponse._organizationLabel;
    this.orgUuid = projectResponse._organizationUuid;
    this.uuid = projectResponse._uuid;
    this.rev = projectResponse._rev;
    this.deprecated = projectResponse._deprecated;
    this.createdAt = projectResponse._createdAt;
    this.createdBy = projectResponse._createdBy;
    this.updatedAt = projectResponse._updatedAt;
    this.updatedBy = projectResponse._updatedBy;
    this.description = projectResponse.description;
  }

  async update(projectPayload: CreateProjectPayload): Promise<Project> {
    try {
      return Project.update(
        this.orgLabel,
        this.label,
        this.rev,
        projectPayload,
      );
    } catch (error) {
      throw error;
    }
  }

  async deprecate(): Promise<Project> {
    try {
      return Project.deprecate(this.orgLabel, this.label, this.rev);
    } catch (error) {
      throw error;
    }
  }

  async listResources(
    pagination?: PaginationSettings,
  ): Promise<PaginatedList<Resource>> {
    try {
      return await Resource.list(this.orgLabel, this.label, pagination);
    } catch (error) {
      throw error;
    }
  }

  async getResource(id: string): Promise<Resource> {
    try {
      return await Resource.get(
        this.orgLabel,
        this.label,
        WILDCARD_SCHEMA_ID,
        id,
      );
    } catch (error) {
      throw error;
    }
  }

  async createFile(file: any): Promise<NexusFile> {
    try {
      return await NexusFile.create(this.orgLabel, this.label, file);
    } catch (error) {
      throw error;
    }
  }

  async listViews(): Promise<(ElasticSearchView | SparqlView)[]> {
    return View.list(this.orgLabel, this.label);
  }

  async getView(viewId: string): Promise<ElasticSearchView | SparqlView> {
    return View.get(this.orgLabel, this.label, viewId);
  }

  async getElasticSearchView(viewId?: string): Promise<ElasticSearchView> {
    return ElasticSearchView.get(this.orgLabel, this.label, viewId);
  }

  async getSparqlView(): Promise<SparqlView> {
    return SparqlView.get(this.orgLabel, this.label);
  }
}
