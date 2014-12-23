module NuPack
  class CostCalculator
    def initialize(markups)
      @markups = markups
    end

    def final_cost(job)
      [
        job.base_price,
        flat_fee(job),
        personnel_fee(job),
        material_fee(job)
      ].
        reduce(:+).
        round(2)
    end

    def flat_fee(job)
      markup_fee(job.base_price, :flat)
    end

    def personnel_fee(job)
      job.required_personnel * markup_fee(cost_with_flat_fee(job), :personnel)
    end

    def material_fee(job)
      markup_fee(cost_with_flat_fee(job), job.material)
    end

    private

    def markup_fee(price, markup_type)
      price * @markups.fetch(markup_type, 0)
    end

    def cost_with_flat_fee(job)
      job.base_price + flat_fee(job)
    end
  end
end