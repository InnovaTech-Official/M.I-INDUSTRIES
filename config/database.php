<?php
// Database configuration file
class Database {
    private $host = 'localhost';
    private $username = 'root';
    private $password = '';
    private $database = 'azizabad_db';
    private $conn;
    
    public function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host=$this->host;dbname=$this->database",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    public function query($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            die("Query failed: " . $e->getMessage());
        }
    }
    
    public function execute($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute($params);
        } catch(PDOException $e) {
            die("Execution failed: " . $e->getMessage());
        }
    }
    
    public function lastInsertId() {
        return $this->conn->lastInsertId();
    }
}