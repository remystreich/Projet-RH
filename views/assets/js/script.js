
console.log(employeeData);
const fonctions = employeeData.map(data => {
    return { label: data.fonction, value: data.fonction };
  });
  

let input = document.getElementById('fonction');

autocomplete({
    input: input,
    fetch: function(text, update) {
        text = text.toLowerCase();
        // you can also use AJAX requests instead of preloaded data
        let suggestions = fonctions.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions);
    },
    onSelect: function(item) {
        input.value = item.label;
    }
});
