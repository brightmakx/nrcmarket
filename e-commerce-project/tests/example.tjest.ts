/*import { describe, it, expect } from "vitest";

describe("Example Test Suite", () => {
    //skipping a test
  it("should pass this example test", () => {
    expect(true).toBe(true);
  });

  //paremeterised tests extract values inside the list ->(it.for([here]))
  //to arguments in the method
    it.for([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
    //%i for extracting values from the rows
    ])('add(%i, %i) -> %i', ([a, b, expected]) => {
    expect(a + b).toBe(expected)
    });

    //use $a,$b ... for object fields
    it.for([
    { a: 1, b: 1, expected: 2 },
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 1, expected: 3 },
    ])('add($a, $b) -> $expected', ({ a, b, expected }) => {
    expect(a + b).toBe(expected)
    })

    //running tests in parallel
    it.concurrent.for([
    [1, 1],
    [1, 2],
    [2, 1],
    ])('add(%i, %i)', ([a, b], { expect }) => {
    expect(a + b).toMatchSnapshot()
    })
});
describe("Example Test Suite", () => {

    //only this test will run in this file
  it("should pass this example test", () => {
    expect(3+4).toBe(7);
  });
  it("should return null",()=>{
    expect(null).toBe(null)
  })
});
*/
