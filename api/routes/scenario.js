var express = require('express');
var router = express.Router();

const scenario = [
  { id: "1", value: "Scenario1"},
  { id: "2", value: "Scenario2"},
  { id: "3", value: "Scenario3"},
  { id: "4", value: "Scenario4"},
  { id: "5", value: "Scenario5"},
]

function findId(id){
  for(let i = 0; i < scenario.length; i++){
    if(scenario[i].id === id) {
      return scenario[i];
    }
  }
}

function getIds(){
  let arr = new Array(scenario.length)
  for(let i = 0; i < scenario.length; i++){
    arr[i] = scenario[i].id;
  }
  return arr;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send("Id")
  res.send(getIds());
});

router.get('/:id', function(req, res, next) {
  let scenario = findId(req.params.id);
  res.send(scenario);
});

module.exports = router;
