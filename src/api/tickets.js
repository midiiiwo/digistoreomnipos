import { Api } from './axiosInstance';

export function getMerchantEvents(merchant) {
  return Api.get(`events/merchant/${merchant}/all`);
}

export function getUserTicketHistory(user) {
  return Api.get(`tickets/validate/history/${user}`);
}

export function getMerchantTicketsSold(merchant, start_date, end_date) {
  return Api.get(
    `/tickets/sold/merchant/${merchant}/${start_date}/${end_date}`,
  );
}

export function getEventTickets(event_code) {
  return Api.get(`/events/${event_code}/tickets`);
}

export function getEventDetails(event_id) {
  return Api.get(`/events/${event_id}`);
}

export function getTicketDetails(ticket_id) {
  return Api.get(`/events/ticket/${ticket_id}`);
}

export function getEventTicketCode(merchant, ticket_name) {
  return Api.get(`/events/code/new/${merchant}/${ticket_name}`);
}

export function getEventDetailsByCode(event_code) {
  return Api.get(`/events/merchant/event/${event_code}`);
}

/******************* MUTATIONS *********************/

export function createMerchantEvent(payload) {
  return Api.post('tickets/validate/history', payload);
}

export function createEventTicket(payload) {
  return Api.post('/events/ticket', payload);
}

export function editMerchantEvent(payload) {
  return Api.put('/events/ticket', payload);
}

export function editEventTicket(payload) {
  return Api.put('/events/ticket', payload);
}

export function deleteEventTicket(payload) {
  return Api.delete('tickets/validate/history');
}

export function deleteMerchantEvent(payload) {
  return Api.delete('tickets/validate/history');
}

export function buyTicket(payload) {
  return Api.post('/tickets/request/process/portal', payload);
}
