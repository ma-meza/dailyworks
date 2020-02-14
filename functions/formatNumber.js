function formatStripeAmountToMoney(stripeAmount) {
        return `$${(stripeAmount / 100).toFixed(2)}`;
      }

function formatMoneyToStripeAmount(USDString) {
  return parseFloat(USDString) * 100;
}

      module.exports = {
        formatStripeAmountToMoney,
        formatMoneyToStripeAmount
      };
