'use strict';

describe('CostCalculator', function() {
  var CostCalculator = require('./CostCalculator.js');

  describe('Unit Tests', function() {
    var calculator, job;

    beforeEach(function() {
      calculator = new CostCalculator({
        flat: 0.1,
        personnel: 0.01,
        materials: {
          food: 0.1
        }
      });
    });

    describe('flatFee', function() {
      it('calculates', function() {
        expect(calculator.flatFee({basePrice: 100})).toEqual(10);
      });
    });

    describe('personnelFee', function() {
      it('calculates', function() {
        var costWithFlatFee = 100 + 100 * 0.1;
        expect(calculator.personnelFee({basePrice: 100, requiredPersonnel: 2})).toEqual(costWithFlatFee * 0.01 * 2);
      });
    });

    describe('materialFee', function() {
      it('calculates', function() {
        var costWithFlatFee = 100 + 100 * 0.1;
        expect(calculator.materialFee({basePrice: 100, material: 'food'})).toEqual(costWithFlatFee * 0.1);
      });
    });
  });

  describe('costFor', function() {
    var calculator, job;

    beforeEach(function() {
      calculator = new CostCalculator();
    });

    describe('$1299, 3 personnel, food', function() {
      it('calculates', function() {
        job = { basePrice: 1299.99, requiredPersonnel: 3, material: 'food' };
        expect(calculator.costFor(job)).toEqual(1591.58);
      });
    });

    describe('$5432, 1 personnel, pharma', function() {
      it('calculates', function() {
        job = { basePrice: 5432, requiredPersonnel: 1, material: 'pharma' };
        expect(calculator.costFor(job)).toEqual(6199.81);
      });
    });

    describe('$5432, 1 personnel, drugs', function() {
      it('calculates', function() {
        job = { basePrice: 12456.95, requiredPersonnel: 4, material: 'books' };
        expect(calculator.costFor(job)).toEqual(13707.63);
      });
    });
  });
});
