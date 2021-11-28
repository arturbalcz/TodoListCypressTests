describe("example to-do app", () => {
  const listItemsSelector = "div.todolist > ul li";

  beforeEach(() => {
    cy.visit("/");
  });

  it("should display three todo items by default", () => {
    cy.get(listItemsSelector).as("listitems");
    cy.get("@listitems").should("have.length", 3);
    cy.get("@listitems")
      .eq(0)
      .should("contain.text", "Learn Javascript")
      .should("have.class", "pending");
    cy.get("@listitems")
      .eq(1)
      .should("contain.text", "Learn React")
      .should("have.class", "pending");
    cy.get("@listitems")
      .eq(2)
      .should("contain.text", "Build a React App")
      .should("have.class", "pending");
    cy.contains("All").should("have.class", "selected");
    cy.contains("3 items left").should("exist");
  });

  it("should input be hidden after clicking Esc than shown again after typing shortcut", () => {
    cy.get("body").type("{esc}");
    cy.get('input[type="text"]').should("not.exist");
    cy.get("body").type("/");
    cy.get("input.search").should("exist");
    cy.get("input.add-todo").should("not.exist");
    cy.get("body").type("{esc}");
    cy.get("body").type("n");
    cy.get("input.search").should("not.exist");
    cy.get("input.add-todo").should("exist");
  });

  it("should add new todo item", () => {
    const newItem = "Test with Cypress";

    cy.get("input.add-todo").type(`${newItem}{enter}`);
    cy.get(listItemsSelector)
      .should("have.length", 4)
      .last()
      .should("contain.text", newItem)
      .should("have.class", "pending");
    cy.contains("4 items left").should("exist");
  });

  it("should not add new empty item", () => {
    const invalidItem = " ";

    cy.get("input.add-todo").type(`${invalidItem}{enter}`);
    cy.get(listItemsSelector)
      .should("have.length", 3)
      .last()
      .should("not.have.text", invalidItem);
    cy.contains("3 items left").should("exist");
  });

  it("should mark item as completed than again as pending", () => {
    const item = "Learn Javascript";

    cy.contains(item).parent().find("input[type=checkbox]").check();
    cy.contains(item).parents("li").should("have.class", "completed");

    cy.contains(item).parent().find("input[type=checkbox]").uncheck();
    cy.contains(item).parents("li").should("have.class", "pending");
  });

  it("should find two items that contain searched word", () => {
    const searchPhase = "Learn";

    cy.get('a[title="Search"]').click();
    cy.get("input.search").type(`${searchPhase}`);
    cy.get(listItemsSelector).as("listitems").should("have.length", 2);
    cy.get("@listitems")
      .eq(0)
      .should("contain.text", "Learn Javascript")
      .should("have.class", "pending");
    cy.get("@listitems")
      .eq(1)
      .should("contain.text", "Learn React")
      .should("have.class", "pending");
    cy.contains("Build a React App").should("not.exist");
  });

  it("should find no items that contain searched word", () => {
    const searchPhase = "Do";

    cy.get('a[title="Search"]').click();
    cy.get("input.search").type(`${searchPhase}`);
    cy.get(listItemsSelector).as("listitems").should("have.length", 0);
    cy.contains("Learn Javascript").should("not.exist");
    cy.contains("Learn React").should("not.exist");
    cy.contains("Build a React App").should("not.exist");
  });

  context("with a checked item", () => {
    const checkedItem = "Learn Javascript";
    beforeEach(() => {
      cy.contains(checkedItem).parent().find("input[type=checkbox]").check();
    });

    it("should filter for active tasks", () => {
      cy.contains("Active").click().should("have.class", "selected");

      // After filtering, we can assert that there is only the one
      // incomplete item in the list.
      cy.get(listItemsSelector).as("listitems").should("have.length", 2);
      cy.get("@listitems")
        .eq(0)
        .should("contain.text", "Learn React")
        .should("have.class", "pending");
      cy.get("@listitems")
        .eq(1)
        .should("contain.text", "Build a React App")
        .should("have.class", "pending");
      cy.contains(checkedItem).should("not.exist");
    });

    it("should filter for completed tasks", () => {
      cy.contains("Completed").click().should("have.class", "selected");

      cy.get(listItemsSelector).as("listitems").should("have.length", 1);
      cy.get("@listitems")
        .first()
        .should("contain.text", checkedItem)
        .should("have.class", "completed");
      cy.contains("Learn React").should("not.exist");
      cy.contains("Build a React App").should("not.exist");
    });

    it("should find one item that contain searched word and is active", () => {
      const searchPhase = "Learn";

      cy.contains("Active").click().should("have.class", "selected");
      cy.get('a[title="Search"]').click();
      cy.get("input.search").type(`${searchPhase}`);
      cy.get(listItemsSelector).as("listitems").should("have.length", 1);
      cy.get("@listitems")
        .first()
        .should("contain.text", "Learn React")
        .should("have.class", "pending");
      cy.contains("Learn Javascript").should("not.exist");
      cy.contains("Build a React App").should("not.exist");
    });
  });
});
