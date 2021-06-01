const textArea = document.querySelector('textarea')

function textareaValue (value) {
  if (textArea) {
    textArea.value = value
  }
}

module.exports = { textareaValue }