interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

interface IEmployeeOrgApp {
  ceo: Employee;
  move(employeeID: number, supervisorID: number): void;
  undo(): void;
  redo(): void;
}

class EmployeeOrgApp implements IEmployeeOrgApp {
  private history: {
    action: "move" | "undo" | "redo";
    employeeID: number;
    oldSupervisor: number;
  }[] = [];

  constructor(public ceo: Employee) {}

  private findEmployeeByID(root: Employee, id: number): Employee | null {
    if (root.uniqueId === id) {
      return root;
    }
    for (const subordinate of root.subordinates) {
      const found = this.findEmployeeByID(subordinate, id);
      if (found) {
        return found;
      }
    }
    return null;
  }

  testMove(employeeID: number): void {
    const employee = this.findEmployeeByID(this.ceo, employeeID);
    console.log(employee, "find");
  }

  //   move(employeeID: number, supervisorID: number): void {
  //     const employee = this.findEmployeeByID(this.ceo, employeeID);
  //     console.log(employee);
  //     const oldSupervisor = employee?.subordinates.find(
  //       (sub) => sub.uniqueId === employeeID
  //     );
  //     console.log(oldSupervisor, "oldSupervisor");
  //     const newSupervisor = this.findEmployeeByID(this.ceo, supervisorID);

  //     if (!employee || !newSupervisor) {
  //       throw new Error("Invalid employee or supervisor ID");
  //     }

  //     this.moveSubordinates(employee, newSupervisor);

  //     if (oldSupervisor) {
  //       oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
  //         (sub) => sub !== employee
  //       );
  //     }

  //     this.history.push({
  //       action: "move",
  //       employeeID,
  //       oldSupervisor: oldSupervisor ? oldSupervisor.uniqueId : -1,
  //     });
  //   }

  private findOldSupervisor(
    root: Employee,
    employee: Employee
  ): Employee | null {
    for (const subordinate of root.subordinates) {
      if (subordinate.subordinates.includes(employee)) {
        return subordinate;
      }
      const found = this.findOldSupervisor(subordinate, employee);
      if (found) {
        return found;
      }
    }
    return null;
  }

  move(employeeID: number, supervisorID: number): void {
    const employee = this.findEmployeeByID(this.ceo, employeeID);
    const oldSupervisor = this.findOldSupervisor(this.ceo, employee!);

    const newSupervisor = this.findEmployeeByID(this.ceo, supervisorID);

    if (!employee || !newSupervisor) {
      throw new Error("Invalid employee or supervisor ID");
    }

    const existingSubordinates = [...employee.subordinates]; // Copy the existing subordinates

    if (oldSupervisor) {
      oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
        (sub) => sub !== employee
      );
    }

    employee.subordinates.length = 0; // Clear the employee's subordinates

    // Assign employee's existing subordinates to Cassandra (oldSupervisor)
    if (oldSupervisor) {
      oldSupervisor.subordinates.push(...existingSubordinates);
    }

    // Move the employee under the new supervisor
    newSupervisor.subordinates.push(employee);

    this.history.push({
      action: "move",
      employeeID,
      oldSupervisor: oldSupervisor ? oldSupervisor.uniqueId : -1,
    });
  }

  undo(): void {
    const lastAction = this.history.pop();
    if (!lastAction) {
      return;
    }

    const { action, employeeID, oldSupervisor } = lastAction;
    const employee = this.findEmployeeByID(this.ceo, employeeID);
    const newSupervisor = this.findEmployeeByID(this.ceo, oldSupervisor);

    if (!employee || !newSupervisor) {
      throw new Error("Invalid employee or supervisor ID");
    }

    if (action === "move") {
      const oldSupervisor = this.findOldSupervisor(this.ceo, employee);

      if (oldSupervisor) {
        oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
          (sub) => sub !== employee
        );
      }

      employee.subordinates.length = 0;

      newSupervisor.subordinates.push(employee);

      // Add the reverted action to the history (for redo)
      this.history.push({
        action: "move",
        employeeID,
        oldSupervisor: newSupervisor.uniqueId,
      });
    }

    // You can handle other types of actions (if any) in the history here.
  }
  redo(): void {}
}

const ceo: Employee = {
  uniqueId: 1,
  name: "John Smith",
  subordinates: [],
};

const johnSmith: Employee = {
  uniqueId: 1,
  name: "John Smith",
  subordinates: [],
};
const margotDonald: Employee = {
  uniqueId: 2,
  name: "Margot Donald",
  subordinates: [],
};
const cassandraReynolds: Employee = {
  uniqueId: 3,
  name: "Cassandra Reynolds",
  subordinates: [],
};
const MaryBlue: Employee = {
  uniqueId: 4,
  name: "Mary Blue",
  subordinates: [],
};
const BobSaget: Employee = {
  uniqueId: 5,
  name: "Bob Seget",
  subordinates: [],
};
const TinaTeff: Employee = {
  uniqueId: 6,
  name: "Tina Teff",
  subordinates: [],
};
const WillTerner: Employee = {
  uniqueId: 7,
  name: "Will Terner",
  subordinates: [],
};
const TylorSimpson: Employee = {
  uniqueId: 8,
  name: "Tylor Simpson",
  subordinates: [],
};
const HarryTobs: Employee = {
  uniqueId: 9,
  name: "Harry Tobs",
  subordinates: [],
};
const ThomasBrown: Employee = {
  uniqueId: 10,
  name: "Thomas Brown",
  subordinates: [],
};
const GeorgeCarrey: Employee = {
  uniqueId: 11,
  name: "George Carrey",
  subordinates: [],
};
const GaryStyles: Employee = {
  uniqueId: 12,
  name: "Gary Styles",
  subordinates: [],
};
const BenWiilis: Employee = {
  uniqueId: 13,
  name: "Ben Wiilis",
  subordinates: [],
};
const GeorginaFlangy: Employee = {
  uniqueId: 14,
  name: "Georgina Flangy",
  subordinates: [],
};
const SophieTurner: Employee = {
  uniqueId: 15,
  name: "Sophie Turner",
  subordinates: [],
};

// Creating the Application
const app = new EmployeeOrgApp(ceo);

//subcordinates of CEO
ceo.subordinates.push(margotDonald, TylorSimpson, BenWiilis, GeorginaFlangy);

//subcordinates of Margot
margotDonald.subordinates.push(cassandraReynolds);
TylorSimpson.subordinates.push(HarryTobs, GeorgeCarrey, GaryStyles);
GeorginaFlangy.subordinates.push(SophieTurner);

cassandraReynolds.subordinates.push(MaryBlue, BobSaget);
HarryTobs.subordinates.push(ThomasBrown);

BobSaget.subordinates.push(TinaTeff);
TinaTeff.subordinates.push(WillTerner);

// employeeId : Id of the employee that we want to move.
// supervisiorId : Id of the supervisor where we want to that employee.

//app.move(employeeId, supervisiorId)
app.move(3, 13);

console.log(ceo, "ceo");

// undo the last action

// setTimeout(() => {
//   app.undo();
//   console.log(ceo, "after undo");
// }, 3000);

// app.redo();
