/// <reference types='cypress'/>

import { postRequestBody } from '../../fixtures/testData.json'

const baseURL = 'https://api.tech-global-training.com'

let studentID;

describe('TechGlobal Students API Tests', () => {
  it('Retrieve all instructors and validate the response', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/instructors/`,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.have.lengthOf(4);

      response.body.forEach((instructor, index) => {
        expect(instructor).to.have.property('INSTRUCTOR_ID');
        expect(instructor.INSTRUCTOR_ID).to.not.be.null;
        expect(instructor).to.have.property('FULLNAME');
        expect(instructor.FULLNAME).to.not.be.null;
        expect(instructor).to.have.property('STUDENTS').to.be.an('array');
      
      const expectedIDs = [1, 2, 3, 4];
      expect(instructor.INSTRUCTOR_ID).to.be.eq(expectedIDs[index]);
      })
    })
    })

  it('Retrieve a single instructor and validate the response', () => {
    let instructorID = 4;
        cy.request({
          method: 'GET',
          url: `${baseURL}/instructors/${instructorID}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.INSTRUCTOR_ID).to.be.eq(instructorID);
          expect(response.body).to.has.property('FULLNAME');
          expect(response.body.FULLNAME).not.to.be.null;
          expect(response.body).to.have.property('STUDENTS').to.be.an('array');
        })
    })

   it('Create a new student and validate its association with the instructor', () => {
        cy.request({
          method: 'POST',
          url: `${baseURL}/students/`,
          body: postRequestBody,
        }).then((response) => {
          expect(response.status).to.eq(201)
        
        studentID = response.body.STUDENT_ID;
        });

        cy.request({
          method: 'GET',
          url: `${baseURL}/instructors/${postRequestBody.INSTRUCTOR_ID}/`,
        }).then((response) => {
            expect(response.status).to.eq(200);

           const students = response.body.STUDENTS;

           expect(students.map(student => student.STUDENT_ID)).to.include(studentID);
        });
   });
        
    it('Delete the newly created student and validate the response', () => {
        cy.request({
          method: 'DELETE',
          url: `${baseURL}/students/${studentID}`,
        }).then((response) => {
          expect(response.status).to.eq(204)
            });
    });
});