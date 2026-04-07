import { apiV1 } from './axios';

const client = apiV1;

export const v1 = {
  // Faculty/Team (legacy)
  getTeam: () => client.get('/team').then((r) => r.data),
  getTeamMember: (slug) => client.get(`/team/${slug}`).then((r) => r.data),

  // Legacy endpoints used by some pages
  getCourses: () => client.get('/courses').then((r) => r.data),
  submitApplicationForm: (payload) => client.post('/application-form/submit', payload).then((r) => r.data),
  submitContactForm: (formData) =>
    client
      .post('/contact/form-submit', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};

export default v1;

