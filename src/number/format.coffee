defaultLocale = require "../core/locale/languages/en_US.coffee"

# Formats numbers to look "pretty"
module.exports = (number, opts) ->

  if "locale" of this
    time = this.locale.value.time
  else
    time = defaultLocale.time

  opts   = {} unless opts
  vars   = opts.vars or {}
  key    = opts.key
  labels = if "labels" of opts then opts.labels else true
  length = number.toString().split(".")[0].length

  time.push vars.time.value if vars.time and vars.time.value

  if typeof key is "string" and time.indexOf(key.toLowerCase()) >= 0
    ret = number
  else if key is "share"
    if number is 0
      ret = 0
    else if number >= 100
      ret = d3.format(",f") number
    else if number > 99
      ret = d3.format(".3g") number
    else
      ret = d3.format(".2g") number
    ret += "%"
  else if number < 10 and number > -10
    ret = d3.round number, 2
  else if length > 3
    symbol = d3.formatPrefix(number).symbol
    symbol = symbol.replace("G", "B") # d3 uses G for giga

    # Format number to precision level using proper scale
    number = d3.formatPrefix(number).scale number
    number = parseFloat d3.format(".3g")(number)
    ret = number + symbol
  else if length is 3
    ret = d3.format(",f") number
  else if number is 0
    ret = 0
  else
    ret = d3.format(".3g") number

  if labels and key and "format" of vars and key of vars.format.affixes.value
    affixes = vars.format.affixes.value[key]
    affixes[0] + ret + affixes[1]
  else
    ret
