<?php
/** @var \App\Model\Comment[] $comments */
/** @var \App\Service\Router $router */

$title = 'Comments List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Comments List</h1>
    <a href="<?= $router->generatePath('comment-create') ?>">Create new comment</a>

    <ul class="index-list">
        <?php foreach ($comments as $comment): ?>
            <li>
                <h3>Comment #<?= $comment->getId() ?> by <?= htmlspecialchars($comment->getAuthor()) ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('comment-show', ['id' => $comment->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('comment-edit', ['id' => $comment->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>
<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
