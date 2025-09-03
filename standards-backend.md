# WebHatchery Backend Standards

This document covers backend development standards for PHP projects.

## 🔧 Backend Standards (PHP)

### Required Dependencies (composer.json)
```json
{
  "require": {
    "php": "^8.1",
    "slim/slim": "^4.11",
    "slim/psr7": "^1.6", 
    "php-di/php-di": "^7.0",
    "illuminate/database": "^10.0",
    "vlucas/phpdotenv": "^5.5",
    "monolog/monolog": "^3.0",
    "respect/validation": "^2.2"
  },
  "require-dev": {
    "phpunit/phpunit": "^10.0",
    "squizlabs/php_codesniffer": "^3.7"
  },
  "scripts": {
    "start": "php -S localhost:8000 -t public/",
    "test": "phpunit",
    "cs-check": "phpcs --standard=PSR12 src/ tests/",
    "cs-fix": "phpcbf --standard=PSR12 src/ tests/"
  }
}
```

### Actions Pattern (MANDATORY)
```php
<?php
// ✅ CORRECT: Actions contain business logic
declare(strict_types=1);

namespace App\Actions;

use App\External\UserRepository;
use App\Models\User;

final class CreateUserAction
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    public function execute(string $name, string $email): User
    {
        // Validation
        if (empty($name) || empty($email)) {
            throw new \InvalidArgumentException('Name and email are required');
        }

        // Business logic
        $user = new User();
        $user->name = $name;
        $user->email = $email;
        $user->created_at = new \DateTime();

        // Persistence
        return $this->userRepository->create($user);
    }
}
```

### Controller Standards (Thin Layer)
```php
<?php
// ✅ CORRECT: Controllers are thin HTTP handlers
declare(strict_types=1);

namespace App\Controllers;

use App\Actions\CreateUserAction;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class UserController
{
    public function __construct(
        private readonly CreateUserAction $createUserAction
    ) {}

    public function create(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            
            $user = $this->createUserAction->execute($data['name'], $data['email']);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $user->toArray()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    }
}
```

### Model Standards (Eloquent)
```php
<?php
// ✅ CORRECT: Typed Eloquent models
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class User extends Model
{
    protected $table = 'users';
    
    protected $fillable = [
        'name',
        'email',
        'level'
    ];

    protected $casts = [
        'level' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

### Repository Pattern (MANDATORY)
```php
<?php
// ✅ CORRECT: Repository for data access
declare(strict_types=1);

namespace App\External;

use App\Models\User;

final class UserRepository
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function create(User $user): User
    {
        $user->save();
        return $user;
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
```

### Service Standards
```php
<?php
// ✅ CORRECT: Services for complex business logic
declare(strict_types=1);

namespace App\Services;

use App\External\UserRepository;
use App\Models\User;

final class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    public function calculateUserLevel(User $user): int
    {
        // Complex business logic
        return min(floor($user->experience / 1000) + 1, 100);
    }

    public function promoteUser(User $user): User
    {
        $newLevel = $this->calculateUserLevel($user);
        $user->level = $newLevel;
        
        return $this->userRepository->update($user);
    }
}
```

## 📁 File Organization Standards

### Backend File Naming  
- **Classes**: PascalCase (`UserController.php`, `CreateUserAction.php`)
- **Interfaces**: PascalCase with Interface suffix (`UserRepositoryInterface.php`)
- **Traits**: PascalCase with Trait suffix (`ApiResponseTrait.php`)

## ❌ Backend Prohibitions
- ❌ Business logic in Controllers
- ❌ Direct database queries in Controllers
- ❌ Missing type declarations (`declare(strict_types=1)`)
- ❌ SQL injection vulnerabilities (use Eloquent/prepared statements)
- ❌ Missing error handling
