<?php
namespace App\Model;

use App\Service\Config;

class Comment
{
    private ?int $id = null;
    private ?int $postId = null;
    private ?string $author = null;
    private ?string $content = null;

    public function getId(): ?int { return $this->id; }
    public function setId(?int $id): Comment { $this->id = $id; return $this; }

    public function getPostId(): ?int { return $this->postId; }
    public function setPostId(?int $postId): Comment { $this->postId = $postId; return $this; }

    public function getAuthor(): ?string { return $this->author; }
    public function setAuthor(?string $author): Comment { $this->author = $author; return $this; }

    public function getContent(): ?string { return $this->content; }
    public function setContent(?string $content): Comment { $this->content = $content; return $this; }

    public static function fromArray(array $array): Comment
    {
        $comment = new self();
        $comment->fill($array);
        return $comment;
    }

    public function fill(array $array): Comment
    {
        if (isset($array['id']) && ! $this->getId()) $this->setId($array['id']);
        if (isset($array['post_id'])) $this->setPostId($array['post_id']);
        if (isset($array['author'])) $this->setAuthor($array['author']);
        if (isset($array['content'])) $this->setContent($array['content']);
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $stmt = $pdo->prepare('SELECT * FROM comment');
        $stmt->execute();
        $comments = [];
        foreach ($stmt->fetchAll(\PDO::FETCH_ASSOC) as $row) {
            $comments[] = self::fromArray($row);
        }
        return $comments;
    }

    public static function find(int $id): ?Comment
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $stmt = $pdo->prepare('SELECT * FROM comment WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $row ? self::fromArray($row) : null;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $stmt = $pdo->prepare('INSERT INTO comment (post_id, author, content) VALUES (:post_id, :author, :content)');
            $stmt->execute([
                'post_id' => $this->getPostId(),
                'author' => $this->getAuthor(),
                'content' => $this->getContent()
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $stmt = $pdo->prepare('UPDATE comment SET post_id = :post_id, author = :author, content = :content WHERE id = :id');
            $stmt->execute([
                'post_id' => $this->getPostId(),
                'author' => $this->getAuthor(),
                'content' => $this->getContent(),
                'id' => $this->getId()
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $stmt = $pdo->prepare('DELETE FROM comment WHERE id = :id');
        $stmt->execute(['id' => $this->getId()]);
        $this->id = null;
        $this->postId = null;
        $this->author = null;
        $this->content = null;
    }
}
