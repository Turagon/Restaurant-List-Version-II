function searchFilter (searchValue, ...targetData) {
  return targetData.filter(item => {
    return item.name.includes(searchValue) || item.category.includes(searchValue)
  })
}

module.exports = {searchFilter}