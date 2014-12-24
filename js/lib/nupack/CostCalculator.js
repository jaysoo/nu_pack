'us strict';

var _ = require('lodash');

var DEFAULT_MARKUPS = {
  flat: 0.05,
  personnel: 0.012,
  materials: {
    electronics: 0.02,
    food: 0.13,
    pharma: 0.075
  }
};

function CostCalculator(markups) {
  this.markups = markups || DEFAULT_MARKUPS;
}

_.extend(CostCalculator.prototype, {
  costFor: function(job) {
    var total = _.reduce([
      job.basePrice,
      this.flatFee(job),
      this.personnelFee(job),
      this.materialFee(job)
    ], plus, 0);

    return round(total);
  },

  flatFee: function(job) {
    return job.basePrice * this.markups.flat;
  },

  personnelFee: function(job) {
    return this.costWithFlatFee(job) * this.markups.personnel * job.requiredPersonnel;
  },

  materialFee: function(job) {
    return this.costWithFlatFee(job) * (this.markups.materials[job.material] || 0);
  },

  costWithFlatFee: function(job) {
    return job.basePrice + this.flatFee(job)
  }
});

function plus(a, b) {
  return a + b;
}

function round(value) {
  return Math.round(value * 100) / 100
}

module.exports = CostCalculator;
