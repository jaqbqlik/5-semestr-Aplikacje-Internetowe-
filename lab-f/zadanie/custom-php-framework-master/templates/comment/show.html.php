<?php
/** @var \App\Model\Comment $comment */
/** @var \App\Service\Router $router */

$title = "Comment #{$comment->getId()} by {$comment->getAuthor()}";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= htmlspecialchars($comment->getAuthor()) ?>'s Comment</h1>
    <article>
        <?= nl2br(htmlspecialchars($comment->getContent())) ?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('comment-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('comment-edit', ['id'=> $comment->getId()]) ?>">Edit</a></li>
    </ul>
<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
