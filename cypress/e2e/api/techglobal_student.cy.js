/// <reference types='cypress'/>

import { postRequestBody, updateRequestBody } from '../../fixtures/testData.json'

const baseURL = 'https://api.tech-global-training.com/students'
let studentID

describe('TechGlobal Students API Tests', () => {
  it('Retrieve all students and validate the response', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.length.gte(2)
      response.body.forEach((student) => {
        expect(student).to.have.property('STUDENT_ID');
      })
    })
  })

  it('Create a new student and validate the response', () => {
    cy.request({
      method: 'POST',
      url: `${baseURL}`,
      body: postRequestBody,
    }).then((response) => {
      cy.log(response)
      expect(response.status).to.eq(201)
      
      studentID = response.body.STUDENT_ID

      expect(studentID).to.be.gte(2)

      Object.entries(postRequestBody).forEach(([key, value]) => {
       expect(response.body[key]).to.eq(value)
      })
    })
  })

  it('Retrieve the newly created student and validate the response', () => {
        cy.request({
          method: 'GET',
          url: `${baseURL}/${studentID}`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          let dateObject = new Date(response.body.DOB);
          let formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${(dateObject.getDate() + 1).toString().padStart(2, '0')}`;
          expect(formattedDate).to.eq(postRequestBody.DOB); 
          expect(response.body.EMAIL).to.eq(postRequestBody.EMAIL);  
          expect(response.body.FIRST_NAME).to.eq(postRequestBody.FIRST_NAME);  
          expect(response.body.LAST_NAME).to.eq(postRequestBody.LAST_NAME);  
          expect(response.body.INSTRUCTOR_ID).to.eq(postRequestBody.INSTRUCTOR_ID); 
    })
    })
  
    it('Update the newly created student with a different instructor and validate the response', () => {
      cy.request({
        method: 'PUT',
        url: `${baseURL}/${studentID}`,
        body: updateRequestBody,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.be.eq(`Successfully updated the student with the STUDENT_ID: ${studentID}`)
      })
  })

   it('Delete the newly created student and validate the response', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseURL}/${studentID}`,
      }).then((response) => {
        expect(response.status).to.eq(204)
        //expect(response.body).to.have.property('message').to.be.eq(`Successfully deleted user with Id: ${studentID}`)
    })
  })
})