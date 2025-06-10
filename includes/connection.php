<?php
class DATABASE
    $host = 'localhost';      // or your server IP
    $port = '5432';           // default PostgreSQL port
    $dbname = 'azizabad';        // your database name
    $user = 'postgres';  // your PostgreSQL username
    $password = 'root';  // your PostgreSQL password

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,  // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch results as associative arrays
    ]);

    // Optional: Uncomment the line below to confirm the connection works
    // echo "Connected to PostgreSQL successfully!";
} catch (PDOException $e) {
    // Handle connection errors
    die("Connection failed: " . $e->getMessage());
}

/**
 * Execute a query and return all rows
 * 
 * @param string $sql SQL query with placeholders
 * @param array $params Parameters to bind to the query
 * @return array Array of records
 */
function db_get_all($sql, $params = []) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        error_log("Query failed: " . $e->getMessage());
        throw new Exception("Error executing query: " . $e->getMessage());
    }
}

/**
 * Execute a query and return a single row
 * 
 * @param string $sql SQL query with placeholders
 * @param array $params Parameters to bind to the query
 * @return array|null Single record or null if not found
 */
function db_get_row($sql, $params = []) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch();
        return $result !== false ? $result : null;
    } catch (PDOException $e) {
        error_log("Query failed: " . $e->getMessage());
        throw new Exception("Error executing query: " . $e->getMessage());
    }
}

/**
 * Execute a query and return a single value
 * 
 * @param string $sql SQL query with placeholders
 * @param array $params Parameters to bind to the query
 * @return mixed|null Single value or null if not found
 */
function db_get_var($sql, $params = []) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchColumn();
        return $result !== false ? $result : null;
    } catch (PDOException $e) {
        error_log("Query failed: " . $e->getMessage());
        throw new Exception("Error executing query: " . $e->getMessage());
    }
}

/**
 * Execute a query that doesn't return results (INSERT, UPDATE, DELETE)
 * 
 * @param string $sql SQL query with placeholders
 * @param array $params Parameters to bind to the query
 * @return int Number of affected rows
 */
function db_query($sql, $params = []) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    } catch (PDOException $e) {
        error_log("Query failed: " . $e->getMessage());
        throw new Exception("Error executing query: " . $e->getMessage());
    }
}

/**
 * Insert a row and return the last insert ID
 * 
 * @param string $table Table name
 * @param array $data Associative array of column => value pairs
 * @return int Last insert ID
 */
function db_insert($table, $data) {
    global $pdo;
    
    try {
        $columns = array_keys($data);
        $placeholders = array_fill(0, count($columns), '?');
        
        $sql = sprintf(
            "INSERT INTO %s (%s) VALUES (%s)",
            $table,
            implode(', ', $columns),
            implode(', ', $placeholders)
        );
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_values($data));
        
        return $pdo->lastInsertId();
    } catch (PDOException $e) {
        error_log("Insert failed: " . $e->getMessage());
        throw new Exception("Error inserting data: " . $e->getMessage());
    }
}

/**
 * Update rows in a table
 * 
 * @param string $table Table name
 * @param array $data Associative array of column => value pairs
 * @param string $where WHERE clause with placeholders
 * @param array $whereParams Parameters for the WHERE clause
 * @return int Number of affected rows
 */
function db_update($table, $data, $where, $whereParams = []) {
    global $pdo;
    
    try {
        $setClauses = [];
        $params = [];
        
        foreach ($data as $column => $value) {
            $setClauses[] = "$column = ?";
            $params[] = $value;
        }
        
        $sql = sprintf(
            "UPDATE %s SET %s WHERE %s",
            $table,
            implode(', ', $setClauses),
            $where
        );
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_merge($params, $whereParams));
        
        return $stmt->rowCount();
    } catch (PDOException $e) {
        error_log("Update failed: " . $e->getMessage());
        throw new Exception("Error updating data: " . $e->getMessage());
    }
}
?>
