describe("example to-do app", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display three todo items by default", () => {
    cy.get("div.todolist > ul li").as("listitems");
    cy.get("@listitems").should("have.length", 3);
    cy.get("@listitems").eq(0).should("contain.text", "Learn Javascript");
    cy.get("@listitems").eq(1).should("contain.text", "Learn React");
    cy.get("@listitems").eq(2).should("contain.text", "Build a React App");
  });

  it("should add new todo item", () => {
    const newItem = "Test with Cypress";

    cy.get("input.add-todo").type(`${newItem}{enter}`);
    cy.get("div.todolist > ul li")
      .should("have.length", 4)
      .last()
      .should("contain.text", newItem);
  });

  it("should not add new empty item", () => {
    const invalidItem = " ";

    cy.get("input.add-todo").type(`${invalidItem}{enter}`);
    cy.get("div.todolist > ul li")
      .should("have.length", 3)
      .last()
      .should("not.have.text", invalidItem);
  });
});
