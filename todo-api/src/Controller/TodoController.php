<?php

namespace App\Controller;

use App\Entity\Todo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/todos')]
class TodoController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $repo = $this->em->getRepository(Todo::class);
        $all = $repo->findAll();

        $data = array_map(fn(Todo $t) => [
            'id'   => (string) $t->getId(),
            'text' => $t->getText(),
            'done' => $t->isDone(),
        ], $all);

        return $this->json($data);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $json = json_decode($request->getContent(), true) ?? [];

        $t = new Todo();
        $t->setText($json['text'] ?? '');
        $t->setDone((bool)($json['done'] ?? false));

        $this->em->persist($t);
        $this->em->flush();

        return $this->json([
            'id'   => (string) $t->getId(),
            'text' => $t->getText(),
            'done' => $t->isDone(),
        ], 201);
    }

    #[Route('/{id}', methods: ['PATCH'])]
    public function patch(string $id, Request $request): JsonResponse
    {
        $t = $this->em->getRepository(Todo::class)->find($id);
        if (!$t) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $json = json_decode($request->getContent(), true) ?? [];

        if (array_key_exists('text', $json)) {
            $t->setText((string) $json['text']);
        }
        if (array_key_exists('done', $json)) {
            $t->setDone((bool) $json['done']);
        }

        $this->em->flush();

        return $this->json([
            'id'   => (string) $t->getId(),
            'text' => $t->getText(),
            'done' => $t->isDone(),
        ]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        $t = $this->em->getRepository(Todo::class)->find($id);
        if ($t) {
            $this->em->remove($t);
            $this->em->flush();
        }

        return new JsonResponse(null, 204);
    }
}
