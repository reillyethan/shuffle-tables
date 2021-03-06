$(document).ready(function () {
  $('#add-table').click(clickAddTable);
  addPropertiesChangeHandler();
});

function addTable() {
  var $table,
    id = Math.floor(Math.random() * 10000).toString(),
    tableData = {
      id: id,
      zoom: 1,
      rotation: 0,
      text: 'New Table'
    };

  localStorage.setItem(id, JSON.stringify(tableData));

  $('.editor').append('<div class="table" id="' + id + '"><p></p></div>');

  $table = $('.editor').find('.table[id='+ id +']').draggable({
    containment: ".editor",
    snap: true
  });

  return $table;
};

function saveState(tableId, $inputs) {
  var tableData = JSON.parse(localStorage.getItem(tableId));

  $inputs.each(function(index, input) {
    var $input = $(input);

    switch ($input.attr('id')) {
      case 'table-zoomer':
        tableData.zoom = $input.val();
        break;
      case 'table-rotator':
        tableData.rotation = $input.val();
        break;
      case 'table-name':
        tableData.text = $input.val();
        break;
      default: break;
    }
  });

  localStorage.setItem(tableId, JSON.stringify(tableData));
};

function setProperties(tableData) {
  $('.object-properties input').each(function(index, input) {
    var $input = $(input);
    $input.removeAttr('disabled');
    $input.parent().find('button').removeAttr('disabled');

    switch ($input.attr('id')) {
      case 'table-zoomer':
        $input.val(tableData.zoom);
        break;
      case 'table-rotator':
        $input.val(tableData.rotation);
        break;
      case 'table-name':
        $input.val(tableData.text);
        break;
      default: break;
    }
  });
};

function saveActiveTable($table) {
  var $activeTable = $('.table.active');
  if ($activeTable.length &&
    'undefined' !== typeof $activeTable.attr('id') &&
    $activeTable.attr('id') !== $table.attr('id')) {
    saveState($activeTable.attr('id'), $('.object-properties input'));
    $activeTable.removeClass('active');
  }
};

function clickTable() {
  var $table = $(this),
    tableData = JSON.parse(localStorage.getItem($table.attr('id'))),
    $activeTable = $('.table.active');

  if (($activeTable.length && $activeTable.attr('id') !== $table.attr('id')) ||
    $activeTable.length === 0) {
    if ($activeTable.length &&
      'undefined' !== typeof $activeTable.attr('id') &&
      $activeTable.attr('id') !== $table.attr('id')) {
      saveState($activeTable.attr('id'), $('.object-properties input'));
      $activeTable.removeClass('active');
    }

    $table.addClass('active');
    setProperties(tableData);
    $table.find('p').text(tableData.text);
  }
};

function clickAddTable() {
  var $table = addTable(),
    tableData = JSON.parse(localStorage.getItem($table.attr('id'))),
    $activeTable = $('.table.active');

  if ($activeTable.length &&
    'undefined' !== typeof $activeTable.attr('id') &&
    $activeTable.attr('id') !== $table.attr('id')) {
    saveState($activeTable.attr('id'), $('.object-properties input'));
    $activeTable.removeClass('active');
  }

  $table.addClass('active');
  if ($('.object-properties').hasClass('disabled')) {
    $('.object-properties').removeClass('disabled');
  }
  setProperties(tableData);
  $table.find('p').text(tableData.text);

  $table.click(clickTable);
};

function addPropertiesChangeHandler() {
  $('.object-properties input').each(function(index, input) {
    $(input).change(propertyChanged);
  });

  $('.object-properties button').each(function(index, button) {
    $(button).click(resetButtonClicked);
  });

  $('.room-properties input').each(function(index, input) {
    $(input).change(roomPropertyChanged);
  });

  $('.room-properties button').each(function(index, button) {
    $(button).click(roomResetButtonClicked);
  });
};

function roomResetButtonClicked() {
  var $button = $(this);

  switch($button.attr('id')) {
    case 'reset-room-length':
      $button.parent().find('input#room-length').val(DEFAULT_ROOM_PARAMS.length)
        .change();
      break;
    case 'reset-room-width':
      $button.parent().find('input#room-width')
        .val(DEFAULT_ROOM_PARAMS.width).change();
      break;
    default: break;
  }
}

function resetButtonClicked() {
  var $button = $(this);

  switch($button.attr('id')) {
    case 'reset-zoom':
      $button.parent().find('input#table-zoomer').val(1).change();
      break;
    case 'reset-rotation':
      $button.parent().find('input#table-rotator')
        .val(DEFAULT_TABLE_PARAMS.rotation).change();
      break;
    default: break;
  }
}

function roomPropertyChanged() {
  var $input = $(this);
  var $room = $('#editor');

  switch ($input.attr('id')) {
    case 'room-length':
      $room.height($input.val());
      break;
    case 'room-width':
      $room.width($input.val());
      break;
    default: break;
  }
};

function propertyChanged() {
  var $input = $(this),
    $activeTable = $('.table.active'),
    tableData = JSON.parse(localStorage.getItem($activeTable.attr('id')));

  switch ($input.attr('id')) {
    case 'table-zoomer':
      tableData.zoom = $input.val();
      break;
    case 'table-rotator':
      tableData.rotation = $input.val();
      break;
    case 'table-name':
      tableData.text = $input.val();
      break;
    default: break;
  }

  $activeTable.find('p').text(tableData.text);
  $activeTable.width(DEFAULT_TABLE_PARAMS.width * tableData.zoom);
  $activeTable.height(DEFAULT_TABLE_PARAMS.height * tableData.zoom);
  $activeTable.css('border-radius', DEFAULT_TABLE_PARAMS.borderRadius * tableData.zoom + 'px');
  $activeTable.find('p').css('font-size', DEFAULT_TABLE_PARAMS.fontSize * tableData.zoom + 'px');
  $activeTable.find('p').css('margin-top', DEFAULT_TABLE_PARAMS.marginTop * tableData.zoom + 'px');
  $activeTable.css({'transform' : 'rotate('+ tableData.rotation +'deg)'});

  localStorage.setItem(tableData.id, JSON.stringify(tableData));
};

var DEFAULT_TABLE_PARAMS = {
  fontSize: 14,
  width: 90,
  height: 30,
  borderRadius: 3,
  marginTop: 7
};

var DEFAULT_ROOM_PARAMS = {
  length: 600,
  width: 700
}
