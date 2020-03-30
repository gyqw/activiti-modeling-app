/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Action } from '@ngrx/store';
import {
    GET_PROJECTS_SUCCESS,
    GetProjectsSuccessAction, CREATE_PROJECT_SUCCESS, CreateProjectSuccessAction,
    UPDATE_PROJECT_SUCCESS, UpdateProjectSuccessAction, DELETE_PROJECT_SUCCESS,
    DeleteProjectSuccessAction, UPLOAD_PROJECT_SUCCESS, UploadProjectSuccessAction
} from '../actions/projects';
import {
    RELEASE_PROJECT_SUCCESS, GET_PROJECTS_ATTEMPT, ReleaseProjectSuccessAction,
    GET_PROJECT_SUCCESS, GetProjectSuccessAction, Pagination, ProjectEntitiesState, initialProjectEntitiesState, projectAdapter,
} from '@alfresco-dbp/modeling-shared/sdk';

export function projectEntitiesReducer(state: ProjectEntitiesState = initialProjectEntitiesState, action: Action): ProjectEntitiesState {
    let newState: ProjectEntitiesState;

    switch (action.type) {

        case GET_PROJECTS_ATTEMPT:
        return {
            ...state,
            loading: true
        };

        case GET_PROJECTS_SUCCESS:
            newState = setProjects(state, <GetProjectsSuccessAction>action);
            break;

        case CREATE_PROJECT_SUCCESS:
            newState = createProject(state, <CreateProjectSuccessAction>action);
            break;

        case UPDATE_PROJECT_SUCCESS:
            newState = updateProject(state, <UpdateProjectSuccessAction>action);
            break;

        case DELETE_PROJECT_SUCCESS:
            newState = deleteProject(state, <DeleteProjectSuccessAction>action);
            break;

        case UPLOAD_PROJECT_SUCCESS:
            newState = uploadProject(state, <UploadProjectSuccessAction> action);
            break;

        case RELEASE_PROJECT_SUCCESS:
            newState = releaseProject(state, <ReleaseProjectSuccessAction> action);
            break;

        case GET_PROJECT_SUCCESS:
            newState = setProject(state, <GetProjectSuccessAction>action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function setProjects(state: ProjectEntitiesState, action: GetProjectsSuccessAction): ProjectEntitiesState {
    const newState = projectAdapter.removeAll({ ...state });
    return projectAdapter.addMany(action.payload, {
        ...newState,
        pagination: <Pagination> action.pagination,
        loading: false,
        loaded: true
    });
}

function createProject(state: ProjectEntitiesState, action: CreateProjectSuccessAction): ProjectEntitiesState {
    return projectAdapter.addOne(action.payload, state);
}

function updateProject(state: ProjectEntitiesState, action: UpdateProjectSuccessAction): ProjectEntitiesState {
    const newState = {
        ...state
    };
    return projectAdapter.updateOne({ ...action.payload, changes: action.payload.changes }, newState);
}

function deleteProject(state: ProjectEntitiesState, action: DeleteProjectSuccessAction): ProjectEntitiesState {
    return projectAdapter.removeOne(action.payload, state);
}

function uploadProject(state: ProjectEntitiesState, action: UploadProjectSuccessAction): ProjectEntitiesState {
    return projectAdapter.addOne(action.payload, state);
}

function releaseProject(state: ProjectEntitiesState, action: ReleaseProjectSuccessAction): ProjectEntitiesState {
    return projectAdapter.updateOne({ id: action.projectId, changes: { version: action.release.version } }, state);
}

function setProject(state: ProjectEntitiesState, action: GetProjectSuccessAction): ProjectEntitiesState {
    return projectAdapter.addOne(action.payload, state);
}
