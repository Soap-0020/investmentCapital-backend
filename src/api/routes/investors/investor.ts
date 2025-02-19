import Route from "../../../types/route";
import publicInvestor from "../../../functions/publicInvestor";

export default {
  path: "/investor/:id",
  method: "get",
  execute: (cache, req, res) => {
    const { id } = req.params;
    const investor = cache.investors.find((investor) => investor.user.id == id);

    if (!investor)
      return res.status(404).json({
        error: "Investor not found.",
      });

    res.json(publicInvestor(investor));
  },
} satisfies Route;
