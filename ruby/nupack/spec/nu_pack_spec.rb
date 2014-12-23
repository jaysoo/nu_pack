require 'rspec'
require 'nu_pack'

describe NuPack::CostCalculator do
  before do
    @calculator = NuPack::CostCalculator.new(
      flat: 0.05,
      personnel: 0.012,
      electronics: 0.02
    )
  end

  describe '#flat_fee' do
    it 'calculates flat fee cost' do
      job = NuPack::Job.new(1000)
      expect(@calculator.flat_fee(job)).to eq(1000 * 0.05)
    end
  end

  describe '#personnel_fee' do
    it 'includes personnel markup on top of flat cost' do
      job = NuPack::Job.new(1000, 1)
      flat_cost = 1000 + (1000 * 0.05)
      expect(@calculator.personnel_fee(job)).to eq(flat_cost * 0.012)
    end

    it 'scales by number of people' do
      job = NuPack::Job.new(1000, 3)
      flat_cost = 1000 + (1000 * 0.05)
      expect(@calculator.personnel_fee(job)).to eq(flat_cost * 0.012 * 3)
    end
  end

  describe '#material_fee' do
    it 'includes material markup on top of flat cost' do
      job = NuPack::Job.new(1000, 1, :electronics)
      flat_cost = 1000 + (1000 * 0.05)
      expect(@calculator.material_fee(job)).to eq(flat_cost * 0.02)
    end

    it 'uses zero markup for materials not listed' do
      job = NuPack::Job.new(1000, 1, :others)
      expect(@calculator.material_fee(job)).to eq(0)
    end
  end

  describe '#final_cost' do
    example do
      calculator = NuPack::CostCalculator.new(
        flat: 0.05,
        personnel: 0.012,
        electronics: 0.02,
        food: 0.13,
        pharma: 0.075
      )

      expect(calculator.final_cost(NuPack::Job.new(1299.99, 3, :food))).to eq(1591.58)
      expect(calculator.final_cost(NuPack::Job.new(5432.00, 1, :pharma))).to eq(6199.81)
      expect(calculator.final_cost(NuPack::Job.new(12456.95, 4, :books))).to eq(13707.63)
    end
  end
end