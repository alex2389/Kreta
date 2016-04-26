/*
 * This file is part of the Kreta package.
 *
 * (c) Beñat Espiña <benatespina@gmail.com>
 * (c) Gorka Laucirica <gorka.lauzirika@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {routeActions} from 'react-router-redux';

import ActionTypes from './../constants/ActionTypes';
import IssueApi from './../api/Issue';
import {projectApiPrivateInstance} from '../api/ApiPrivate';

const Actions = {
  fetchProject: (organization, project) => {
    return (dispatch, getState) => {
      dispatch({
        type: ActionTypes.CURRENT_PROJECT_FETCHING
      });

      projectApiPrivateInstance.getProjectByOrganization(organization, project)
        .then((receivedProject) => {
          dispatch({
            type: ActionTypes.CURRENT_PROJECT_RECEIVED,
            project: receivedProject,
            filters: _generateFilters(receivedProject, getState().profile.profile)
          });

          IssueApi.getIssues({project: receivedProject.id})
            .then((issues) => {
              dispatch({
                type: ActionTypes.CURRENT_PROJECT_ISSUES_RECEIVED,
                issues
              });
            });
        });
    };
  },
  selectCurrentIssue: (issue) => {
    if (typeof issue === 'object' || issue === null) {
      return {
        type: ActionTypes.CURRENT_PROJECT_SELECTED_ISSUE_CHANGED,
        selectedIssue: issue
      };
    }

    return (dispatch) => {
      dispatch({
        type: ActionTypes.CURRENT_PROJECT_SELECTED_ISSUE_FETCHING
      });
      IssueApi.getIssue(issue)
        .then((receivedIssue) => {
          dispatch({
            type: ActionTypes.CURRENT_PROJECT_SELECTED_ISSUE_CHANGED,
            selectedIssue: receivedIssue
          });
        });
    };
  },
  createIssue: (issueData, currentProject) => {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.CURRENT_PROJECT_ISSUE_CREATING
      });
      IssueApi.postIssue(issueData)
        .then((createdIssue) => {
          dispatch({
            type: ActionTypes.CURRENT_PROJECT_ISSUE_CREATED,
            issue: createdIssue
          });
          dispatch(
            routeActions.push(
              `/${currentProject.organization.slug}/${currentProject.slug}/issue/${createdIssue.id}`
            )
          );
        })
        .catch((errorData) => {
          errorData.then((errors) => {
            dispatch({
              type: ActionTypes.CURRENT_PROJECT_ISSUE_CREATE_ERROR,
              errors
            });
          });
        });
    };
  },
  updateIssue: (issueData, issueId) => {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.CURRENT_PROJECT_ISSUE_UPDATE
      });
      IssueApi.putIssue(issueId, issueData)
        .then((updatedIssue) => {
          dispatch({
            type: ActionTypes.CURRENT_PROJECT_ISSUE_UPDATED,
            issue: updatedIssue
          });
        })
        .catch((errorData) => {
          errorData.then((errors) => {
            dispatch({
              type: ActionTypes.CURRENT_PROJECT_ISSUE_UPDATE_ERROR,
              errors
            });
          });
        });
    };
  },
  transitionIssue: (transitionId, issueId) => {
    return (dispatch) => {
      dispatch({
        type: ActionTypes.CURRENT_PROJECT_ISSUE_TRANSITION
      });
      IssueApi.transitionIssue(issueId, {transition: transitionId})
        .then((updatedIssue) => {
          dispatch({
            type: ActionTypes.CURRENT_PROJECT_ISSUE_TRANSITIONED,
            issue: updatedIssue
          });
        })
        .catch((errorData) => {
          errorData.then((errors) => {
            dispatch({
              type: ActionTypes.CURRENT_PROJECT_ISSUE_UPDATE_ERROR,
              errors
            });
          });
        });
    };
  },
  filterIssues: (filters) => {
    return (dispatch, getState) => {
      dispatch({
        type: ActionTypes.CURRENT_PROJECT_ISSUE_FILTERING,
        filters
      });
      const request = {
        project: getState().currentProject.project.id
      };
      filters.forEach((filter) => {
        filter.forEach((item) => {
          if (item.selected) {
            request[item.filter] = item.value;
          }
        });
      });
      IssueApi.getIssues(request)
        .then((filteredIssues) => {
          dispatch({
            type: ActionTypes.CURRENT_PROJECT_ISSUE_FILTERED,
            issues: filteredIssues
          });
        });
    };
  },
  addParticipant: (user) => {
    return (dispatch) => {
      const participant = {
        role: 'ROLE_PARTICIPANT',
        user
      };

      setTimeout(() => {
        dispatch({
          type: ActionTypes.CURRENT_PROJECT_PARTICIPANT_ADDED,
          participant
        });
      });
    };
  }
};

function _generateFilters(project, profile) {
  const assigneeFilters = [{
      filter: 'assignee',
      selected: true,
      title: 'All',
      value: ''
    }, {
      filter: 'assignee',
      selected: false,
      title: 'Assigned to me',
      value: profile.id
    }],
    priorityFilters = [{
      filter: 'priority',
      selected: true,
      title: 'All priorities',
      value: ''
    }],
    statusFilters = [{
      filter: 'status',
      selected: true,
      title: 'All statuses',
      value: ''
    }];

  project.issue_priorities.forEach((priority) => {
    priorityFilters.push({
      filter: 'priority',
      selected: false,
      title: priority.name,
      value: priority.id
    });
  });

  project.workflow.statuses.forEach((status) => {
    statusFilters.push({
      filter: 'status',
      selected: false,
      title: status.name,
      value: status.id
    });
  });

  return [assigneeFilters, priorityFilters, statusFilters];
}

export default Actions;