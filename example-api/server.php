<?php
/**
 * Sample php server script for a wookmark integration
 *
 * @author Sebastian Helzle <sebastian@helzle.net>
 */

/**
 * Basic class which provides all functions to retrieve and paginate pictures
 */
class PictureDatabase {

  /**
   * @var array $data
   */
  protected $data;

  /**
   * @var int $itemsPerPage
   */
  protected $itemsPerPage;

  function __construct($data, $itemsPerPage) {
    $this->data = $data;
    $this->itemsPerPage = $itemsPerPage;
  }

  /**
   * Returns the pictures of the given page or an empty array if page doesn't exist
   * @param int $page
   * @return array
   */
  public function getPage($page=1) {
    if ($page > 0 && $page <= $this->getNumberOfPages()) {
      $startOffset = ($page - 1) * $this->itemsPerPage;
      return array_slice($this->data, $startOffset, $this->itemsPerPage);
    }
    return array();
  }

  /**
   * Returns the maximum number of pages
   * @return int
   */
  public function getNumberOfPages() {
    return ceil(count($this->data) / $this->itemsPerPage);
  }
}

// Our data source
$data = array(
  array(
    'id' => "1",
    'title' => "First image",
    'url' => "http://www.example.org/1",
    'width' => "200",
    'height' => "283",
    'image' => "../sample-images/image_1_big.jpg",
    'preview' => "../sample-images/image_1.jpg"
  ),
  array(
    'id' => "2",
    'title' => "Second image",
    'url' => "http://www.example.org/2",
    'width' => "200",
    'height' => "300",
    'image' => "../sample-images/image_2_big.jpg",
    'preview' => "../sample-images/image_2.jpg"
  ),
  array(
    'id' => "3",
    'title' => "Third image",
    'url' => "http://www.example.org/3",
    'width' => "200",
    'height' => "252",
    'image' => "../sample-images/image_3_big.jpg",
    'preview' => "../sample-images/image_3.jpg"
  ),
  array(
    'id' => "4",
    'title' => "Fourth image",
    'url' => "http://www.example.org/4",
    'width' => "200",
    'height' => "158",
    'image' => "../sample-images/image_4_big.jpg",
    'preview' => "../sample-images/image_4.jpg"
  ),
  array(
    'id' => "5",
    'title' => "Fifth image",
    'url' => "http://www.example.org/5",
    'width' => "200",
    'height' => "300",
    'image' => "../sample-images/image_5_big.jpg",
    'preview' => "../sample-images/image_5.jpg"
  ),
  array(
    'id' => "6",
    'title' => "Sixth image",
    'url' => "http://www.example.org/6",
    'width' => "200",
    'height' => "297",
    'image' => "../sample-images/image_6_big.jpg",
    'preview' => "../sample-images/image_6.jpg"
  ),
  array(
    'id' => "7",
    'title' => "Seventh image",
    'url' => "http://www.example.org/7",
    'width' => "200",
    'height' => "200",
    'image' => "../sample-images/image_7_big.jpg",
    'preview' => "../sample-images/image_7.jpg"
  ),
  array(
    'id' => "8",
    'title' => "Eight image",
    'url' => "http://www.example.org/8",
    'width' => "200",
    'height' => "200",
    'image' => "../sample-images/image_8_big.jpg",
    'preview' => "../sample-images/image_8.jpg"
  ),
  array(
    'id' => "9",
    'title' => "Ninth image",
    'url' => "http://www.example.org/9",
    'width' => "200",
    'height' => "398",
    'image' => "../sample-images/image_9_big.jpg",
    'preview' => "../sample-images/image_9.jpg"
  ),
  array(
    'id' => "10",
    'title' => "Tenth image",
    'url' => "http://www.example.org/10",
    'width' => "200",
    'height' => "267",
    'image' => "../sample-images/image_10_big.jpg",
    'preview' => "../sample-images/image_10.jpg"
  )
);

// Make data array a bit bigger to have more pages
for ($i=0; $i<3; $i++) {
  $data = array_merge($data, $data);
}

// Create instance of picture database with 10 items per page and our data as source
$pictureDatabase = new PictureDatabase($data, 10);

$result = array(
  'success' => TRUE,
  'message' => 'Retrieved pictures',
  'data' => array()
);

$callback = isset($_REQUEST['callback']) ? $_REQUEST['callback'] : false;

// Get requested page number from request and return error message if parameter is not a number
$page = 1;
try {
  $page = intval($_REQUEST['page']);
} catch (Exception $e) {
  $result['success'] = FALSE;
  $result['message'] = 'Parameter page is not a number';
}

// Get data from database
$result['data'] = $pictureDatabase->getPage($page);

if (count($result['data']) == 0 || $page >= $pictureDatabase->getNumberOfPages()) {
  $result['success'] = TRUE;
  $result['message'] = 'No more pictures';
}

// Encode data as json or jsonp and return it
if ($callback) {
  header('Content-Type: application/javascript');
  echo $callback.'('.json_encode($result).')';
} else {
  header('Content-Type: application/json');
  echo json_encode($result);
}
