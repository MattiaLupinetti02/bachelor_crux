<?php
// includes/database.php
require_once 'config.php';

class Database {
    private $conn;
    
    public function __construct() {
        try {
            $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            
            $this->conn->set_charset("utf8mb4");
        } catch (Exception $e) {
            die("Database connection error: " . $e->getMessage());
        }
    }
    
    public function getConnection() {
        return $this->conn;
    }
    
    public function query($sql) {
        return $this->conn->query($sql);
    }
    
    public function escape($string) {
        return $this->conn->real_escape_string($string);
    }
    
    public function getItemsByType($type = 'book') {
        $type = $this->escape($type);
        $items = [];
        
        $sql = "SELECT wi.*, c.name as category_name 
                FROM wheel_items wi
                JOIN categories c ON wi.category_id = c.id
                WHERE c.type = '$type' AND wi.is_active = 1
                ORDER BY wi.id ASC";
        
        $result = $this->query($sql);
        
        if ($result && $result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $items[] = $row;
            }
        }
        
        return $items;
    }
    
    public function saveSpinResult($item_id, $type = 'book') {
        $item_id = $this->escape($item_id);
        $type = $this->escape($type);
        
        $sql = "INSERT INTO spin_results (item_id, category_type) VALUES ('$item_id', '$type')";
        return $this->query($sql);
    }
    
    public function __destruct() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>