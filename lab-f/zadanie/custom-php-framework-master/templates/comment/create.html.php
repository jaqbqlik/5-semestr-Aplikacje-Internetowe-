<?php
/** @var \App\Model\Comment|null $comment */
/** @var \App\Service\Router $router */

$title = 'Create Comment';
$bodyClass = 'create';

ob_start(); ?>
    <h1>Create Comment</h1>
    <form action="<?= $router->generatePath('comment-create') ?>" method="post">
        <?php require __DIR__ . '/_form.html.php'; ?>
        <input type="hidden" name="action" value="comment-create">
    </form>

    <a href="<?= $router->generatePath('comment-index') ?>">Back to list</a>
<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
