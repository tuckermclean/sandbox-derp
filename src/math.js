function mean(nums) {
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

module.exports = { mean };
